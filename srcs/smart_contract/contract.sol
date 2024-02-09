// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleContract {
    struct WinnerRecord {
        string tournamentOrganizer;
        string winner;
    }

    WinnerRecord[] private winnersLedger;

    function setWinner(string memory winner, string memory tournamentOrganizer) public {
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
