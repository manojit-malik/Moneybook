package com.man.moneybook.repository;

import com.man.moneybook.entity.Transaction;
import com.man.moneybook.enums.TransactionType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    void shouldFindTransactionsByUserId() {

        String userId = "user123";

        Transaction tx = Transaction.builder()
                .userId(userId)
                .type(TransactionType.INCOME)
                .amount(BigDecimal.valueOf(1000))
                .category("Salary")
                .transactionDate(LocalDate.now())
                .build();

        transactionRepository.save(tx);

        List<Transaction> result =
                transactionRepository.findByUserId(userId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAmount())
                .isEqualByComparingTo("1000");
    }

    @Test
    void shouldReturnEmptyListWhenNoTransactionsExist() {
        List<Transaction> result =
                transactionRepository.findByUserId("unknownUser");

        assertThat(result).isEmpty();
    }

}
