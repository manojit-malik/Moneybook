package com.man.moneybook.entity;

import com.man.moneybook.enums.TransactionType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;

@Document(collection = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    private String id;

    private BigDecimal amount;
    private TransactionType type;
    private String category;
    private String description;
    private String counterparty;
    private String notes;
    private LocalDate transactionDate;

    //  Mongo reference
    private String userId;
}
