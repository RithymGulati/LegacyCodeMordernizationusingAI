/**
 * Curated sample snippets for the /analyze workspace.
 * @type {{ id: string, label: string, code: string }[]}
 */
export const ANALYZE_SAMPLE_SNIPPETS = [
  {
    id: "java-payment",
    label: "Java Payment",
    code: `package com.legacy.billing;

import java.math.BigDecimal;
import java.util.List;

public class PaymentProcessor {
  public BigDecimal sumInvoices(List<LineItem> items) {
    BigDecimal total = BigDecimal.ZERO;
    for (LineItem item : items) {
      total = total.add(item.getAmount());
    }
    return total;
  }
}`,
  },
  {
    id: "java-login",
    label: "Java Login",
    code: `package com.legacy.auth;

import java.util.Map;

public class LoginServlet {
  public boolean authenticate(String user, String pass, Map<String, String> db) {
    String stored = db.get(user);
    return stored != null && stored.equals(pass);
  }
}`,
  },
  {
    id: "python-payroll",
    label: "Python Payroll",
    code: `def calculate_bonus(salary, rating):
    # legacy rule from HR spreadsheet
    if rating > 4:
        return salary * 0.15
    elif rating > 3:
        return salary * 0.08
    return 0.0

def payroll_report(employees):
    total = 0.0
    for e in employees:
        total += e["salary"] + calculate_bonus(e["salary"], e["rating"])
    print("Total payroll:", total)
    return total`,
  },
  {
    id: "cobol-batch",
    label: "COBOL Batch",
    code: `       IDENTIFICATION DIVISION.
       PROGRAM-ID. ACCTPOST.
       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01 WS-AMOUNT PIC 9(9)V99.
       PROCEDURE DIVISION.
           PERFORM UNTIL WS-AMOUNT = ZERO
             CALL "POSTLINE" USING WS-AMOUNT
           END-PERFORM
           GOBACK.`,
  },
];
