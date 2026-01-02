package com.man.moneybook.service;

import com.man.moneybook.entity.Transaction;

import java.math.BigDecimal;
import java.util.List;

public interface TransactionService {

    Transaction save(Transaction transaction);

    List<Transaction> findByUserId(Long userId);

    BigDecimal calculateBalance(List<Transaction> transactions);

    BigDecimal totalLoanTaken(List<Transaction> transactions);

    BigDecimal totalLoanGiven(List<Transaction> transactions);
}
