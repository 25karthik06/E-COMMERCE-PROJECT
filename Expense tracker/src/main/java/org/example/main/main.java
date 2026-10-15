package org.example.main;

import org.example.dto.ExpenseDto;
import org.example.entity.Expense;
import org.example.service.ExpenseService;
import org.example.service.impl.ExpenseServiceImpl;
import org.example.util.InputUtil;

import java.time.LocalDate;
import java.util.Scanner;

public class main {
    static void main() {
        /*Scanner sc=new Scanner(System.in);
        ExpenseService service=new ExpenseServiceImpl();

        System.out.println("Enter id");
        int id=sc.nextInt();
        System.out.println("Enter Amount");
        double amount=sc.nextDouble();
        sc.nextLine();
        System.out.println("Enter Category:");
        String category=sc.nextLine();
        System.out.println("Enter Description:");
        String description=sc.nextLine();

        Expense expense=new Expense(id,amount,category, LocalDate.now(),description);

        service.addExpense(expense);

        Expense result=service.getExpenseById(id);

        if(result!=null){
            System.out.println("/n---------------------");
            System.out.println("ID    :"+result.getId());
            System.out.println("Amount   :"+result.getAmount());
            System.out.println("Category :"+result.getCategory());
            System.out.println("Date     :"+result.getDate());
            System.out.println("Description:"+result.getDescription());
        }else{
            System.out.println("Expense not found");
        }
        sc.close();*/
        ExpenseService service = new ExpenseServiceImpl();

        while (true) {

            System.out.println("\n===== EXPENSE TRACKER =====");
            System.out.println("1. Add Expense");
            System.out.println("2. Find Expense");
            System.out.println("3. Update Expense");
            System.out.println("4. Delete Expense");
            System.out.println("5. Exit");

            int choice = InputUtil.getInt("Enter your choice: ");

            switch (choice) {

                case 1:
                    // Add Expense
                    int id = InputUtil.getInt("Enter ID: ");
                    double amount = InputUtil.getDouble("Enter Amount: ");
                    String category = InputUtil.getString("Enter Category: ");
                    String description =
                            InputUtil.getString("Enter Description: ");

                    ExpenseDto dto = new ExpenseDto();

                    dto.setId(id);
                    dto.setAmount(amount);
                    dto.setCategory(category);
                    dto.setDate(LocalDate.now());
                    dto.setDescription(description);

                    service.addExpense(dto);

                    System.out.println("Expense added successfully!");
                    break;

                case 2:
                    // Find Expense
                    int findId = InputUtil.getInt("Enter ID: ");

                    // service.getExpenseById(findId);

                    System.out.println("Find Expense");
                    break;

                case 3:
                    // Update Expense
                    System.out.println("Update Expense");
                    break;

                case 4:
                    // Delete Expense
                    System.out.println("Delete Expense");
                    break;

                case 5:
                    System.out.println("Thank you!");
                    System.exit(0);
                    break;

                default:
                    System.out.println("Invalid choice!");
            }
        }
    }
}
