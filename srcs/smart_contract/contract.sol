// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleContract {
    struct WinnerRecord {
        string tournamentOrganizer;
        string winner;
    }
    address creator;

    WinnerRecord[] private winnersLedger;

    constructor() {
        creator = msg.sender;
        winnersLedger.push(WinnerRecord("Initial Organizer", "Initial Winner"));
    }

    modifier onlyCreator() {
        require(msg.sender == creator, "you are not a creator");
        _;
    }

    function setWinner(string memory winner, string memory tournamentOrganizer) public onlyCreator {

        winnersLedger.push(WinnerRecord(winner, tournamentOrganizer));
    }

    function getWinnerHistory(uint256 index) public view returns (string memory, string memory) {
        require(index < winnersLedger.length, "Index out of bounds");
        WinnerRecord memory record = winnersLedger[index];
        return (record.winner, record.tournamentOrganizer);
    }

    function getWinnerCount() public view returns (uint256) {
        return winnersLedger.length;
    }
    function getAllWinnersHistory() public view returns(WinnerRecord[] memory){
        return (winnersLedger);
    }
}
