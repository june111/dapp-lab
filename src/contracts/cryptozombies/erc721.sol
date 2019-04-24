pragma solidity ^0.5.2;

contract ERC721 {
  event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
  event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

  function balanceOf(address owner) public view returns (uint256 balance);
  function ownerOf(uint256 tokenId) public view returns (address owner);
  function transferFrom(address from, address to, uint256 tokenId) public;
  function approve(address to, uint256 tokenId) public;
}
