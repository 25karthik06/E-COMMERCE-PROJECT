package org.example.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Scanner;

public class InputUtil {
    private InputUtil(){

    }
    /*public static int acceptMenuOption(Scanner scanner) {
        System.out.println("Press 1 to add new student.");
        System.out.println("Press 2 to fetch student details.");
        System.out.println("Press 3 to update course details of student.");
        System.out.println("Press 4 to delete student details.");
        int menuOption = scanner.nextInt();
        if (menuOption == 1 || menuOption == 2 || menuOption == 3 || menuOption == 4) {
            return menuOption;
        } else {
            return acceptMenuOption(scanner);
        }
    }
    public static boolean wantToContinue(Scanner scanner) {
        System.out.println("Press Y to continue and N to exit.");
        char choice = scanner.next().toUpperCase().charAt(0);
        return 'Y' == choice;
    }

    public static LocalDate convertStringToDate(String stringDate) {
        DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        return LocalDate.parse(stringDate, format);
    }*/

    private static Scanner sc = new Scanner(System.in);

    public static int getInt(String message) {
        System.out.print(message);
        return sc.nextInt();
    }

    public static double getDouble(String message) {
        System.out.print(message);
        return sc.nextDouble();
    }

    public static String getString(String message) {
        sc.nextLine(); // clear buffer
        System.out.print(message);
        return sc.nextLine();
    }
}
