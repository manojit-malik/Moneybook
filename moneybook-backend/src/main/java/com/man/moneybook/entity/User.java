package com.man.moneybook.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String firstName;
    private String lastName;

    private String email;
    private String password;

    // Optional helper (not stored)
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
