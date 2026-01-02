package com.man.moneybook.service;

import com.man.moneybook.entity.Transaction;
import com.man.moneybook.enums.TransactionType;
import com.man.moneybook.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest
class TransactionServiceImplTest {

    @Autowired
    private TransactionService transactionService;

    @MockBean
    private TransactionRepository transactionRepository;

    @Test
    void shouldCalculateBalanceCorrectly() {

        Transaction income = new Transaction();
        income.setType(TransactionType.INCOME);
        income.setAmount(BigDecimal.valueOf(1000));
        income.setTransactionDate(LocalDate.now());

        Transaction expense = new Transaction();
        expense.setType(TransactionType.EXPENSE);
        expense.setAmount(BigDecimal.valueOf(400));
        expense.setTransactionDate(LocalDate.now());

        BigDecimal balance =
                transactionService.calculateBalance(List.of(income, expense));

        assertThat(balance).isEqualByComparingTo("600");
    }
}
