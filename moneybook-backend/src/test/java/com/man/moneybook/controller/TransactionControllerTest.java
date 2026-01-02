package com.man.moneybook.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.man.moneybook.dto.transaction.TransactionRequestDto;
import com.man.moneybook.entity.Transaction;
import com.man.moneybook.entity.User;
import com.man.moneybook.enums.TransactionType;
import com.man.moneybook.repository.TransactionRepository;
import com.man.moneybook.repository.UserRepository;
import com.man.moneybook.util.SecurityUtils;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TransactionController.class)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionRepository transactionRepository;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldCreateTransactionSuccessfully() throws Exception {

        // ✅ Mongo-style user
        User user = User.builder()
                .id("user123")
                .email("test@gmail.com")
                .build();

        when(userRepository.findByEmail("test@gmail.com"))
                .thenReturn(Optional.of(user));

        when(transactionRepository.save(any(Transaction.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TransactionRequestDto dto = new TransactionRequestDto();
        dto.setType(TransactionType.INCOME);
        dto.setCategory("Salary");
        dto.setAmount(BigDecimal.valueOf(50000));
        dto.setDescription("December Salary");
        dto.setTransactionDate(LocalDate.now());

        // ✅ Mock SecurityUtils.getCurrentUserEmail()
        try (MockedStatic<SecurityUtils> utilities =
                     mockStatic(SecurityUtils.class)) {

            utilities.when(SecurityUtils::getCurrentUserEmail)
                    .thenReturn("test@gmail.com");

            mockMvc.perform(post("/transactions")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(dto)))
                    .andExpect(status().isOk());
        }
    }
}
