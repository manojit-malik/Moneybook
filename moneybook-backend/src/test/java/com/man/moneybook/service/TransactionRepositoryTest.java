package com.man.moneybook.service;

import com.man.moneybook.entity.Transaction;
import com.man.moneybook.entity.User;
import com.man.moneybook.enums.TransactionType;
import com.man.moneybook.repository.TransactionRepository;
import com.man.moneybook.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindTransactionsByUserId() {

        // create user
        User user = new User();
        user.setEmail("test@gmail.com");
        user.setPassword("pass");
        user.setName("Test");
        user = userRepository.save(user);

        // create transaction
        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setType(TransactionType.INCOME);
        tx.setAmount(BigDecimal.valueOf(1000));
        tx.setTransactionDate(LocalDate.now());

        transactionRepository.save(tx);

        // execute
        List<Transaction> result =
                transactionRepository.findByUser_Id(user.getId());

        // verify
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAmount())
                .isEqualByComparingTo("1000");
    }
}
