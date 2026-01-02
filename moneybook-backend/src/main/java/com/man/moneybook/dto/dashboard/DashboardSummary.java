package com.man.moneybook.dto.dashboard;

import java.math.BigDecimal;

public class DashboardSummary {

    private BigDecimal balance;
    private BigDecimal totalLoanTaken;
    private BigDecimal totalLoanGiven;

    public DashboardSummary(BigDecimal balance,
                            BigDecimal totalLoanTaken,
                            BigDecimal totalLoanGiven) {
        this.balance = balance;
        this.totalLoanTaken = totalLoanTaken;
        this.totalLoanGiven = totalLoanGiven;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public BigDecimal getTotalLoanTaken() {
        return totalLoanTaken;
    }

    public BigDecimal getTotalLoanGiven() {
        return totalLoanGiven;
    }
}
