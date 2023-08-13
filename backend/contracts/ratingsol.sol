// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
//Contract for RateChain which will attest user address with the selected contract addfress and the rating
import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
import {SchemaResolver} from "./SchemaResolver.sol";
import {Attestation} from "./helpers/Common.sol";
import {IEAS} from "./interfaces/IEAS.sol";

contract ratingsol is SchemaResolver {
    using ByteHasher for bytes;


    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();
    error InvalidScore();

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID internal immutable worldId;

    /// @dev The contract's external nullifier hash
    uint256 internal immutable externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;

    /// @param _worldId The widcontraact instance that will verify the proofs
    /// @param _eascontract The EAS instance that will be used for deploying attestations
    /// @param _widkey The World ID app ID
    /// @param _actionId The World ID action ID
    constructor(
        IWorldID _worldId,
        IEAS _eascontract,
        string memory _widkey,
        string memory _actionId
    ) SchemaResolver(_eascontract) {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_widkey).hashToField(), _actionId)
            .hashToField();
    }

    function onAttest(
        Attestation calldata attestation,
        uint256
    ) internal override onlyEAS returns (bool) {
        (
            uint8 score,
            uint256 root,
            uint256 nullifierHash,
            uint256[8] memory proof
        ) = abi.decode(attestation.data, (uint8, uint256, uint256, uint256[8]));

        if (score == 0 || score > 10) {
            revert InvalidScore();
        }

        bytes memory signal = abi.encodePacked(
            attestation.attester,
            attestation.recipient,
            score
        );

        return verifyAndExecute(signal, root, nullifierHash, proof);
    }

    /// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further details)
    /// @param root The root of the Merkle tree (returned by the JS widget).
    /// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
    /// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
    function verifyAndExecute(
        bytes memory signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] memory proof
    ) public returns (bool) {
        // to check if the person already exist
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        //  user is verified by World ID
      
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        // preventing from bot attacks . No same user can do it again
        nullifierHashes[nullifierHash] = true;

        return true;
    }

    function onRevoke(
        Attestation calldata attestation,
        uint256
    ) internal override onlyEAS returns (bool) {
        return true;
    }
}
