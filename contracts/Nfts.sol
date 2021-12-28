// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Nfts is ERC721URIStorage {

    uint256 public price = 0.1 ether;

    using Counters for Counters.Counter;
    Counters.Counter internal _tokenIds;
    
    constructor() ERC721("Students", "STS") {}

    function awardItem(address user, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(user, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function getCount() public view returns (uint256){
        uint256 count = _tokenIds.current();
        return count;
    }

    function getPrice() public view returns (uint256){
        uint256 res = price;
        return res;
    }
}