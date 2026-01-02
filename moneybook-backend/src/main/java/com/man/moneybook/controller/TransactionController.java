package com.man.moneybook.controller;

import com.man.moneybook.dto.dashboard.DashboardSummary;
import com.man.moneybook.dto.transaction.TransactionRequestDto;
import com.man.moneybook.entity.Transaction;
import com.man.moneybook.entity.User;
import com.man.moneybook.enums.TransactionType;
import com.man.moneybook.repository.TransactionRepository;
import com.man.moneybook.repository.UserRepository;
import com.man.moneybook.util.SecurityUtils;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionController(TransactionRepository transactionRepository,
                                 UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    // ADD TRANSACTION
    @PostMapping
    public Transaction add(@RequestBody TransactionRequestDto dto) {

        User user = userRepository
                .findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow();

        // Validation for loan / recovery / settlement
        if ((dto.getType() == TransactionType.LOAN_TAKEN
                || dto.getType() == TransactionType.LOAN_GIVEN
                || dto.getType() == TransactionType.RECOVERY
                || dto.getType() == TransactionType.SETTLEMENT)
                && (dto.getCounterparty() == null
                || dto.getCounterparty().isBlank())) {

            throw new IllegalArgumentException(
                    "Counterparty required for loan, recovery and settlement transactions"
            );
        }

        Transaction tx = Transaction.builder()
                .userId(user.getId())
                .type(dto.getType())
                .category(dto.getCategory())
                .amount(dto.getAmount())
                .description(dto.getDescription())
                .counterparty(dto.getCounterparty())
                .transactionDate(dto.getTransactionDate())
                .build();

        return transactionRepository.save(tx);
    }

    // GET TRANSACTION TYPE
    @GetMapping("/types")
    public List<TransactionType> getTransactionTypes() {
        return Arrays.asList(TransactionType.values());
    }

    // GET TRANSACTION BY ID (for edit prefill)
    @GetMapping("/{id}")
    public Transaction getById(@PathVariable String id) {

        User user = userRepository
                .findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow();

        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        if (!tx.getUserId().equals(user.getId())) {
            throw new SecurityException("Unauthorized");
        }

        return tx;
    }

    // UPDATE TRANSACTION
    @PutMapping("/{id}")
    public Transaction update(
            @PathVariable String id,
            @RequestBody TransactionRequestDto dto
    ) {
        User user = userRepository
                .findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow();

        Transaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));

        if (!tx.getUserId().equals(user.getId())) {
            throw new SecurityException("Unauthorized");
        }

        // DO NOT ALLOW TYPE CHANGE
        // tx.setType(...) ← intentionally NOT allowed

        // Validation
        if ((tx.getType() == TransactionType.LOAN_TAKEN
                || tx.getType() == TransactionType.LOAN_GIVEN
                || tx.getType() == TransactionType.RECOVERY
                || tx.getType() == TransactionType.SETTLEMENT)
                && (dto.getCounterparty() == null || dto.getCounterparty().isBlank())) {
            throw new IllegalArgumentException("Counterparty required");
        }

        tx.setCategory(dto.getCategory());
        tx.setAmount(dto.getAmount());
        tx.setDescription(dto.getDescription());
        tx.setCounterparty(dto.getCounterparty());
        tx.setTransactionDate(dto.getTransactionDate());

        return transactionRepository.save(tx);
    }


    // DASHBOARD SUMMARY
    @GetMapping("/summary")
    public DashboardSummary summary() {

        User user = userRepository
                .findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow();

        List<Transaction> txs =
                transactionRepository.findByUserId(user.getId());

        /* ---------------- BALANCE ---------------- */
        BigDecimal balance = txs.stream()
                .map(tx -> switch (tx.getType()) {
                    case INCOME, LOAN_TAKEN, RECOVERY -> tx.getAmount();
                    case EXPENSE, LOAN_GIVEN, SETTLEMENT -> tx.getAmount().negate();
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        /* ---------------- LOAN TAKEN ---------------- */
        BigDecimal loanTaken = txs.stream()
                .filter(t -> t.getType() == TransactionType.LOAN_TAKEN)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal settled = txs.stream()
                .filter(t -> t.getType() == TransactionType.SETTLEMENT)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netLoanTaken = loanTaken.subtract(settled);

        /* ---------------- LOAN GIVEN ---------------- */
        BigDecimal loanGiven = txs.stream()
                .filter(t -> t.getType() == TransactionType.LOAN_GIVEN)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal recovered = txs.stream()
                .filter(t -> t.getType() == TransactionType.RECOVERY)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netLoanGiven = loanGiven.subtract(recovered);

        return new DashboardSummary(balance, netLoanTaken, netLoanGiven);
    }

    // LIST TRANSACTIONS
    @GetMapping
    public List<Transaction> list() {

        User user = userRepository
                .findByEmail(SecurityUtils.getCurrentUserEmail())
                .orElseThrow();

        return transactionRepository.findByUserId(user.getId());
    }
}
