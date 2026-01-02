package com.man.moneybook.dto.transaction;

import com.man.moneybook.enums.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionRequestDto {

    private TransactionType type;
    private String category;
    private BigDecimal amount;
    private String description;
    private String counterparty;   // required for loans
    private LocalDate transactionDate;
}
