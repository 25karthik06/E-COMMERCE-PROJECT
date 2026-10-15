package org.example.repository.impl;

import org.example.entity.Expense;
import org.example.repository.ExpenseRepository;

import java.util.ArrayList;
import java.util.List;

public class ExpenseRepositoryImpl implements ExpenseRepository {
    private List<Expense> expenses=new ArrayList<>();
    @Override
    public void save(Expense e) {
        expenses.add(e);
        System.out.println("saved");
    }

    @Override
    public void delete(Expense e) {
        expenses.remove(e);
        System.out.println("deleted");
    }

    @Override
    public void update(Expense e) {
        for(int i=0;i<expenses.size();i++){
            if(expenses.get(i).getId()==e.getId()){
                expenses.set(i,e);
                System.out.println("updated");
                return;
            }
        }
        System.out.println("expenses not found");
    }

    @Override
    public Expense findById(int id) {
        for(Expense e:expenses){
            if(e.getId()==id){
                return e;
            }
        }
        return null;
    }
}
