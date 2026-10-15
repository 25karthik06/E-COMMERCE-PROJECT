package org.example.service.impl;

import org.example.dto.ExpenseDto;
import org.example.entity.Expense;
import org.example.repository.ExpenseRepository;
import org.example.repository.impl.ExpenseRepositoryImpl;
import org.example.service.ExpenseService;

public class ExpenseServiceImpl implements ExpenseService {

    private ExpenseRepository repository=new ExpenseRepositoryImpl();

    @Override
    public void addExpense(ExpenseDto e) {
        repository.save(e);
    }

    @Override
    public void deleteExpense(Expense e) {
        repository.delete(e);
    }

    @Override
    public void updateExpense(Expense e) {
        repository.delete(e);
    }

    @Override
    public Expense getExpenseById(int id) {
        return repository.findById(id);
    }
}
