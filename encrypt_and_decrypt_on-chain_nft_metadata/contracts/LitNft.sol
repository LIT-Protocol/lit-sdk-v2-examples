// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract LitNft is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721 ("Lit NFT", "LITNFT"){
    }

    function getTokenURI(
        string memory name,
        string memory encryptedDescription,
        string memory imageUrl
    ) public pure returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "', name, '",',
                '"description": "', encryptedDescription, '",',
                '"image": "', imageUrl, '"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function mintLitNft(
        string memory name,
        string memory encryptedDescription,
        string memory imageUrl
    ) public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, getTokenURI(name, encryptedDescription, imageUrl));
    }
}
