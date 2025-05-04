
import React, { useState, useCallback } from "react";
import Layout from "@/components/Layout";
import TransactionModal from "@/components/TransactionModal";
import TransactionList from "@/components/TransactionList";
import AppHeader from "@/components/AppHeader";
import SummaryCards from "@/components/SummaryCards";
import CategoryStatsModal from "@/components/CategoryStatsModal";
import ActionButtons from "@/components/ActionButtons";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { useTransactions } from "@/hooks/useTransactions";
import { useBudget } from "@/hooks/useBudget";
import { generateMonthlySummaryPDF } from '@/lib/pdfGenerator';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const {
    transactions,
    loading: transactionsLoading,
    editingTransaction,
    transactionToDelete,
    isModalOpen,
    balance,
    currentMonthIncome,
    currentMonthFoodExpenses,
    currentMonthMiscExpenses,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    handleEditTransaction,
    handleDeleteClick,
    handleOpenModal,
    handleCloseModal,
    setTransactionToDelete,
  } = useTransactions();

  const {
    budgets,
    loading: budgetsLoading,
    isEditing,
    tempBudgets,
    handleEditToggle,
    handleTempBudgetChange,
    handleBudgetSave,
  } = useBudget();

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  const handleOpenStatsModal = () => setIsStatsModalOpen(true);
  const handleCloseStatsModal = () => setIsStatsModalOpen(false);

  const handleExportPDF = useCallback(() => {
     if (!transactionsLoading && !budgetsLoading) {
        generateMonthlySummaryPDF(transactions, budgets);
     } else {
        console.log("Data still loading, cannot generate PDF yet.");
     }
  }, [transactions, budgets, transactionsLoading, budgetsLoading]);

  const confirmDeleteTransaction = useCallback((id) => {
      deleteTransaction(id);
  }, [deleteTransaction]);

  const cancelDeleteTransaction = useCallback(() => {
      setTransactionToDelete(null);
  }, [setTransactionToDelete]);

  const isLoading = transactionsLoading || budgetsLoading;

  return (
    <Layout>
      <AppHeader onAddClick={handleOpenModal} />

      {isLoading ? (
         <div className="flex justify-center items-center h-64">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
         </div>
       ) : (
        <>
          <SummaryCards
            balance={balance}
            budgets={budgets}
            currentMonthIncome={currentMonthIncome}
            currentMonthFoodExpenses={currentMonthFoodExpenses}
            currentMonthMiscExpenses={currentMonthMiscExpenses}
            isEditing={isEditing}
            tempBudgets={tempBudgets}
            onEditBudgetToggle={handleEditToggle}
            onTempBudgetChange={handleTempBudgetChange}
            onBudgetSave={handleBudgetSave}
          />

          <ActionButtons
            onStatsClick={handleOpenStatsModal}
            onPdfClick={handleExportPDF}
          />

          <TransactionList
            transactions={transactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteClick}
          />
        </>
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTransaction={addTransaction}
        onUpdateTransaction={updateTransaction}
        editingTransaction={editingTransaction}
      />

      <CategoryStatsModal
        isOpen={isStatsModalOpen}
        onClose={handleCloseStatsModal}
        transactions={transactions}
      />

      <DeleteConfirmationDialog
         isOpen={!!transactionToDelete}
         onCancel={cancelDeleteTransaction}
         onConfirm={confirmDeleteTransaction}
         transactionId={transactionToDelete?.id}
       />
    </Layout>
  );
}

export default AppContent;
