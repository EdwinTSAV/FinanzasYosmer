
import React from 'react';
import SummaryCards from "@/components/SummaryCards";
import ActionButtons from "@/components/ActionButtons";
import TransactionList from "@/components/TransactionList";

function DashboardContent({
  balance,
  budgets,
  currentMonthIncome,
  currentMonthFoodExpenses,
  currentMonthMiscExpenses,
  isEditing,
  tempBudgets,
  onEditBudgetToggle,
  onTempBudgetChange,
  onBudgetSave,
  onStatsClick,
  onPdfClick,
  onExcelClick, // Added Excel handler prop
  transactions,
  onEditTransaction,
  onDeleteTransactionClick,
}) {
  return (
    <>
      <SummaryCards
        balance={balance}
        budgets={budgets}
        currentMonthIncome={currentMonthIncome}
        currentMonthFoodExpenses={currentMonthFoodExpenses}
        currentMonthMiscExpenses={currentMonthMiscExpenses}
        isEditing={isEditing}
        tempBudgets={tempBudgets}
        onEditBudgetToggle={onEditBudgetToggle}
        onTempBudgetChange={onTempBudgetChange}
        onBudgetSave={onBudgetSave}
      />

      <ActionButtons
        onStatsClick={onStatsClick}
        onPdfClick={onPdfClick}
        onExcelClick={onExcelClick} // Pass Excel handler
      />

      <TransactionList
        transactions={transactions}
        onEdit={onEditTransaction}
        onDelete={onDeleteTransactionClick}
      />
    </>
  );
}

export default DashboardContent;
