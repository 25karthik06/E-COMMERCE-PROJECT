package org.example.service;

import org.example.dto.ExpenseDto;
import org.example.entity.Expense;

public interface ExpenseService {
    void addExpense(ExpenseDto e);

    void deleteExpense(Expense e);

    void updateExpense(Expense e);

    Expense getExpenseById(int id);
}
