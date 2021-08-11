pragma solidity ^0.4.18;

contract Treasure {
  mapping (bytes32 => uint8) public treasuresReceived;
  bytes32[] public treasureList;
  
  /**
  * Constructor
  **/
  function Treasure(bytes32[] treasureNames) public {
    treasureList = treasureNames;
  }

  // count total treasure
  function totalTreasuresFor(bytes32 treasure) view public returns (uint8) {
    require(validTreasure(treasure));
    return treasuresReceived[treasure];
  }

  // increase number treasure
  function claimForTreasure(bytes32 treasure) public {
    require(validTreasure(treasure));
    treasuresReceived[treasure] += 1;
  }
  
  // get valid treasure
  function validTreasure(bytes32 treasure) view public returns (bool) {
      for(uint i = 0; i < treasureList.length; i++) {
          if (treasureList[i] == treasure) {
            return true;
          }
        }
        return false;
      }
  }
