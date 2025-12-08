// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract VolatilityPrediction {
    AggregatorV3Interface internal priceFeed;
    
    address public owner;
    uint256 public entryFee = 0.000001 ether;
    uint256 public roundDuration = 1 minutes;
    bool public bettingPaused = false;
    
    uint256 public currentRoundId = 0;
    
    struct Bet {
        address bettor;
        bool predictMoreVolatile; // true = MORE, false = LESS
        uint256 timestamp;
    }
    
    struct Round {
        uint256 startTime;
        uint256 endTime;
        int256 startPrice;
        int256 endPrice;
        uint256 volatilityPercent; // in basis points (10000 = 100%)
        Bet[] bets;
        uint256 totalPot;
        uint256 moreBets;
        uint256 lessBets;
        bool settled;
        bool moreVolatileWon;
    }
    
    mapping(uint256 => Round) public rounds;
    uint256 public previousVolatility;
    
    event BetPlaced(uint256 indexed roundId, address indexed bettor, bool predictMoreVolatile, uint256 timestamp);
    event RoundStarted(uint256 indexed roundId, uint256 startTime, int256 startPrice);
    event RoundSettled(uint256 indexed roundId, uint256 volatilityPercent, bool moreVolatileWon, uint256 totalPot);
    event PrizeDistributed(uint256 indexed roundId, address indexed winner, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor(address _priceFeed) {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(_priceFeed);
        _startNewRound();
    }
    
    function placeBet(bool predictMoreVolatile) external payable {
        require(!bettingPaused, "Betting paused");
        require(msg.value == entryFee, "Incorrect entry fee");
        require(block.timestamp < rounds[currentRoundId].endTime, "Round ended");
        
        Round storage round = rounds[currentRoundId];
        
        round.bets.push(Bet({
            bettor: msg.sender,
            predictMoreVolatile: predictMoreVolatile,
            timestamp: block.timestamp
        }));
        
        round.totalPot += msg.value;
        
        if (predictMoreVolatile) {
            round.moreBets++;
        } else {
            round.lessBets++;
        }
        
        emit BetPlaced(currentRoundId, msg.sender, predictMoreVolatile, block.timestamp);
    }
    
    function settleRound() external onlyOwner {
        Round storage round = rounds[currentRoundId];
        require(block.timestamp >= round.endTime, "Round not ended");
        require(!round.settled, "Already settled");
        
        // Get current BTC price
        (, int256 price, , , ) = priceFeed.latestRoundData();
        round.endPrice = price;
        
        // Calculate volatility (absolute percentage change in basis points)
        uint256 priceChange = round.endPrice > round.startPrice 
            ? uint256(round.endPrice - round.startPrice) 
            : uint256(round.startPrice - round.endPrice);
        
        round.volatilityPercent = (priceChange * 10000) / uint256(round.startPrice);
        
        // Determine winner
        if (currentRoundId == 0) {
            // First round - set baseline, refund all
            previousVolatility = round.volatilityPercent;
            _refundAll(currentRoundId);
        } else if (round.bets.length == 1) {
            // Only one participant - refund
            _refundAll(currentRoundId);
        } else if (round.moreBets == 0 || round.lessBets == 0) {
            // All bets on same side
            round.moreVolatileWon = round.volatilityPercent > previousVolatility;
            _distributeSameSide(currentRoundId);
        } else {
            // Normal distribution
            round.moreVolatileWon = round.volatilityPercent > previousVolatility;
            _distributeWinnings(currentRoundId);
        }
        
        round.settled = true;
        previousVolatility = round.volatilityPercent;
        
        emit RoundSettled(currentRoundId, round.volatilityPercent, round.moreVolatileWon, round.totalPot);
        
        // Start next round
        currentRoundId++;
        _startNewRound();
    }
    
    function _startNewRound() internal {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        
        Round storage newRound = rounds[currentRoundId];
        newRound.startTime = block.timestamp;
        newRound.endTime = block.timestamp + roundDuration;
        newRound.startPrice = price;
        
        emit RoundStarted(currentRoundId, block.timestamp, price);
    }
    
    function _refundAll(uint256 roundId) internal {
        Round storage round = rounds[roundId];
        
        for (uint256 i = 0; i < round.bets.length; i++) {
            payable(round.bets[i].bettor).transfer(entryFee);
            emit PrizeDistributed(roundId, round.bets[i].bettor, entryFee);
        }
    }
    
    function _distributeSameSide(uint256 roundId) internal {
        Round storage round = rounds[roundId];
        
        bool winningSide = round.moreVolatileWon;
        uint256 winnerCount = 0;
        
        // Count winners
        for (uint256 i = 0; i < round.bets.length; i++) {
            if (round.bets[i].predictMoreVolatile == winningSide) {
                winnerCount++;
            }
        }
        
        if (winnerCount == 0) return;
        
        uint256 prizePool = (round.totalPot * 90) / 100;
        uint256 prizePerWinner = prizePool / winnerCount;
        uint256 ownerFee = round.totalPot - prizePool;
        
        // Distribute
        for (uint256 i = 0; i < round.bets.length; i++) {
            if (round.bets[i].predictMoreVolatile == winningSide) {
                payable(round.bets[i].bettor).transfer(prizePerWinner);
                emit PrizeDistributed(roundId, round.bets[i].bettor, prizePerWinner);
            }
        }
        
        payable(owner).transfer(ownerFee);
    }
    
    function _distributeWinnings(uint256 roundId) internal {
        Round storage round = rounds[roundId];
        
        bool winningSide = round.moreVolatileWon;
        uint256 winnerCount = 0;
        
        // Count winners
        for (uint256 i = 0; i < round.bets.length; i++) {
            if (round.bets[i].predictMoreVolatile == winningSide) {
                winnerCount++;
            }
        }
        
        if (winnerCount == 0) return;
        
        uint256 prizePool = (round.totalPot * 90) / 100;
        uint256 prizePerWinner = prizePool / winnerCount;
        uint256 ownerFee = round.totalPot - prizePool;
        
        // Distribute to winners
        for (uint256 i = 0; i < round.bets.length; i++) {
            if (round.bets[i].predictMoreVolatile == winningSide) {
                payable(round.bets[i].bettor).transfer(prizePerWinner);
                emit PrizeDistributed(roundId, round.bets[i].bettor, prizePerWinner);
            }
        }
        
        payable(owner).transfer(ownerFee);
    }
    
    // View functions
    function getCurrentRoundInfo() external view returns (
        uint256 roundId,
        uint256 startTime,
        uint256 endTime,
        int256 startPrice,
        uint256 totalPot,
        uint256 moreBets,
        uint256 lessBets,
        bool bettingOpen
    ) {
        Round storage round = rounds[currentRoundId];
        return (
            currentRoundId,
            round.startTime,
            round.endTime,
            round.startPrice,
            round.totalPot,
            round.moreBets,
            round.lessBets,
            block.timestamp < round.endTime && !bettingPaused
        );
    }
    
    function getRoundBets(uint256 roundId) external view returns (Bet[] memory) {
        return rounds[roundId].bets;
    }
    
    function getRoundDetails(uint256 roundId) external view returns (
        uint256 volatilityPercent,
        bool moreVolatileWon,
        uint256 totalPot,
        bool settled
    ) {
        Round storage round = rounds[roundId];
        return (
            round.volatilityPercent,
            round.moreVolatileWon,
            round.totalPot,
            round.settled
        );
    }
    
    function getCurrentBTCPrice() external view returns (int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }
    
    // Admin functions
    function updateEntryFee(uint256 _newFee) external onlyOwner {
        entryFee = _newFee;
    }
    
    function updateRoundDuration(uint256 _newDuration) external onlyOwner {
        roundDuration = _newDuration;
    }
    
    function pauseBetting(bool _pause) external onlyOwner {
        bettingPaused = _pause;
    }
    
    function withdrawEmergency() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
