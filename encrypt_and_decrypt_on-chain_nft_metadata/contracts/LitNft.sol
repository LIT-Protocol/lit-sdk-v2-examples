// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract LitNft is ERC721URIStorage, ReentrancyGuard {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721 ("Lit NFT", "LITNFT"){}

    mapping(uint256 => nft) private tokenIdToNft;

    struct nft {
        uint256 tokenId;
        string name;
        string encryptedDescription;
        string imageUrl;
        address owner;
    }

    function getTokenURI(
        string memory name,
        string memory encryptedDescription,
        string memory imageUrl
    ) private pure returns (string memory) {
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
    ) public nonReentrant {
        _tokenIds.increment();
        uint256 newNftTokenId = _tokenIds.current();
        _safeMint(msg.sender, newNftTokenId);
        _setTokenURI(newNftTokenId, getTokenURI(name, encryptedDescription, imageUrl));
        tokenIdToNft[newNftTokenId] = nft(newNftTokenId, name, encryptedDescription, imageUrl, msg.sender);
    }

    function fetchNfts() public view returns (nft[] memory) {
        nft[] memory nfts = new nft[](_tokenIds.current());
        for (uint256 idx = 1; idx < _tokenIds.current() + 1; idx++) {
            nft memory currNft = tokenIdToNft[idx];
            nfts[idx - 1] = currNft;
        }

        return nfts;
    }
}
