package org.example.repository;

import org.example.entity.Expense;

public interface ExpenseRepository {
    void save(Expense e);
    void delete(Expense e);
    void update(Expense e);
    Expense findById(int id);
}
