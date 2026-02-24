import { useState, useMemo } from 'react'
import { Calculator, Home, TrendingDown, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

type RepaymentType = 'equal-interest' | 'equal-principal'
type PrepaymentType = 'reduce-payment' | 'shorten-term'
type LoanType = 'commercial' | 'fund' | 'combined'

interface LoanConfig {
  loanType: LoanType
  commercialAmount: number
  commercialRate: number
  commercialMonths: number
  fundAmount: number
  fundRate: number
  fundMonths: number
  repaymentType: RepaymentType
}

interface PrepaymentConfig {
  enabled: boolean
  amount: number
  atMonth: number
  type: PrepaymentType
}

interface RefinanceConfig {
  enabled: boolean
  amount: number
  newRate: number
  newMonths: number
  paymentMethod: 'equal-principal-interest' | 'interest-first'
  averageDailyBalance?: number
  repayMonth?: number
}

interface PaymentSchedule {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

const calculateEqualInterestPayment = (principal: number, monthlyRate: number, months: number) => {
  if (monthlyRate === 0) return principal / months
  return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
}

const calculateLoanSchedule = (
  principal: number,
  annualRate: number,
  years: number,
  type: RepaymentType,
  startMonth: number = 0
): { schedule: PaymentSchedule[], totalPayment: number, totalInterest: number } => {
  const monthlyRate = annualRate / 100 / 12
  const months = years * 12
  const schedule: PaymentSchedule[] = []
  let balance = principal

  if (type === 'equal-interest') {
    const monthlyPayment = calculateEqualInterestPayment(principal, monthlyRate, months)
    
    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate
      const principalPaid = monthlyPayment - interest
      balance -= principalPaid
      if (balance < 0) balance = 0

      schedule.push({
        month: startMonth + i,
        payment: monthlyPayment,
        principal: principalPaid,
        interest,
        balance
      })
    }

    const totalPayment = monthlyPayment * months
    const totalInterest = totalPayment - principal

    return { schedule, totalPayment, totalInterest }
  } else {
    const monthlyPrincipal = principal / months
    let totalPayment = 0
    let totalInterest = 0

    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate
      const payment = monthlyPrincipal + interest
      balance -= monthlyPrincipal
      if (balance < 0) balance = 0

      totalPayment += payment
      totalInterest += interest

      schedule.push({
        month: startMonth + i,
        payment,
        principal: monthlyPrincipal,
        interest,
        balance
      })
    }

    return { schedule, totalPayment, totalInterest }
  }
}

export function MortgageCalculator() {
  const [loan, setLoan] = useState<LoanConfig>({
    loanType: 'commercial',
    commercialAmount: 1000000,
    commercialRate: 3.5,
    commercialMonths: 360,
    fundAmount: 500000,
    fundRate: 3.1,
    fundMonths: 360,
    repaymentType: 'equal-interest'
  })

  const [prepayment, setPrepayment] = useState<PrepaymentConfig>({
    enabled: false,
    amount: 100000,
    atMonth: 1,
    type: 'reduce-payment'
  })

  const [refinance, setRefinance] = useState<RefinanceConfig>({
    enabled: false,
    amount: 100000,
    newRate: 3.0,
    newMonths: 36,
    paymentMethod: 'equal-principal-interest',
    averageDailyBalance: 0,
    repayMonth: 0
  })

  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const updateLoan = (field: keyof LoanConfig, value: number | RepaymentType | LoanType) => {
    setLoan(prev => ({ ...prev, [field]: value }))
  }

  const updatePrepayment = (field: keyof PrepaymentConfig, value: number | PrepaymentType | boolean) => {
    setPrepayment(prev => ({ ...prev, [field]: value as never }))
  }

  const updateRefinance = (field: keyof RefinanceConfig, value: number | boolean | string) => {
    setRefinance(prev => ({ ...prev, [field]: value as never }))
  }

  const toggleSection = (section: string) => {
    const newExpanded = expandedSection === section ? null : section
    
    setExpandedSection(newExpanded)
    
    if (section === 'prepayment') {
      setPrepayment(prev => ({ ...prev, enabled: newExpanded === section }))
      setRefinance(prev => ({ ...prev, enabled: false }))
    } else if (section === 'refinance') {
      setRefinance(prev => ({ ...prev, enabled: newExpanded === section }))
      setPrepayment(prev => ({ ...prev, enabled: false }))
    }
  }

  const commercialLoan = useMemo(() => {
    return calculateLoanSchedule(
      loan.commercialAmount,
      loan.commercialRate,
      loan.commercialMonths / 12,
      loan.repaymentType
    )
  }, [loan.commercialAmount, loan.commercialRate, loan.commercialMonths, loan.repaymentType])

  const fundLoan = useMemo(() => {
    return calculateLoanSchedule(
      loan.fundAmount,
      loan.fundRate,
      loan.fundMonths / 12,
      loan.repaymentType
    )
  }, [loan.fundAmount, loan.fundRate, loan.fundMonths, loan.repaymentType])

  const combinedSchedule = useMemo(() => {
    if (loan.loanType === 'commercial') {
      return commercialLoan.schedule
    }
    
    if (loan.loanType === 'fund') {
      return fundLoan.schedule
    }
    
    const schedule: PaymentSchedule[] = []
    const maxMonths = Math.max(
      commercialLoan.schedule.length,
      fundLoan.schedule.length
    )

    for (let i = 0; i < maxMonths; i++) {
      const comm = commercialLoan.schedule[i] || { payment: 0, principal: 0, interest: 0, balance: 0 }
      const fund = fundLoan.schedule[i] || { payment: 0, principal: 0, interest: 0, balance: 0 }
      
      schedule.push({
        month: i + 1,
        payment: comm.payment + fund.payment,
        principal: comm.principal + fund.principal,
        interest: comm.interest + fund.interest,
        balance: comm.balance + fund.balance
      })
    }

    return schedule
  }, [loan.loanType, commercialLoan.schedule, fundLoan.schedule])

  const baseSummary = useMemo(() => {
    let totalLoan = 0
    let totalPayment = 0
    let totalInterest = 0

    if (loan.loanType === 'commercial') {
      totalLoan = loan.commercialAmount
      totalPayment = commercialLoan.totalPayment
      totalInterest = commercialLoan.totalInterest
    } else if (loan.loanType === 'fund') {
      totalLoan = loan.fundAmount
      totalPayment = fundLoan.totalPayment
      totalInterest = fundLoan.totalInterest
    } else {
      totalLoan = loan.commercialAmount + loan.fundAmount
      totalPayment = commercialLoan.totalPayment + fundLoan.totalPayment
      totalInterest = commercialLoan.totalInterest + fundLoan.totalInterest
    }

    const monthlyPayment = combinedSchedule[0]?.payment || 0

    return {
      totalLoan,
      totalPayment,
      totalInterest,
      monthlyPayment
    }
  }, [loan.loanType, loan.commercialAmount, loan.fundAmount, commercialLoan.totalPayment, fundLoan.totalPayment, commercialLoan.totalInterest, fundLoan.totalInterest, combinedSchedule])

  const prepaymentResult = useMemo(() => {
    if (!prepayment.enabled || prepayment.atMonth <= 0 || prepayment.atMonth >= combinedSchedule.length) {
      return null
    }

    const atMonth = prepayment.atMonth
    const beforeState = combinedSchedule[atMonth - 1]
    const newPrincipal = beforeState.balance - prepayment.amount
    const remainingMonths = combinedSchedule.length - atMonth

    if (newPrincipal <= 0) {
      return {
        newSchedule: [] as PaymentSchedule[],
        savings: commercialLoan.totalInterest + fundLoan.totalInterest - combinedSchedule.slice(0, atMonth).reduce((sum: number, s: PaymentSchedule) => sum + s.interest, 0),
        newTotalPayment: combinedSchedule.slice(0, atMonth).reduce((sum: number, s: PaymentSchedule) => sum + s.payment, 0) + prepayment.amount,
        originalRemainingPayment: combinedSchedule.slice(atMonth).reduce((sum: number, s: PaymentSchedule) => sum + s.payment, 0),
        newMonthlyPayment: 0,
        originalMonthlyPayment: combinedSchedule[atMonth]?.payment || 0,
        monthsSaved: combinedSchedule.length - atMonth
      }
    }

    if (prepayment.type === 'reduce-payment') {
      const beforeCommercial = commercialLoan.schedule[atMonth - 1]
      const beforeFund = fundLoan.schedule[atMonth - 1]
      
      let newCommercialPrincipal = beforeCommercial.balance
      let newFundPrincipal = beforeFund.balance
      
      if (loan.loanType === 'commercial') {
        newCommercialPrincipal = beforeCommercial.balance - prepayment.amount
      } else if (loan.loanType === 'fund') {
        newFundPrincipal = beforeFund.balance - prepayment.amount
      } else {
        const totalBalance = beforeCommercial.balance + beforeFund.balance
        newCommercialPrincipal = beforeCommercial.balance - (prepayment.amount * (beforeCommercial.balance / totalBalance))
        newFundPrincipal = beforeFund.balance - (prepayment.amount * (beforeFund.balance / totalBalance))
      }
      
      let newMonthlyPayment = 0
      
      if (loan.loanType === 'commercial') {
        newMonthlyPayment = calculateEqualInterestPayment(Math.max(0, newCommercialPrincipal), loan.commercialRate / 100 / 12, remainingMonths)
      } else if (loan.loanType === 'fund') {
        newMonthlyPayment = calculateEqualInterestPayment(Math.max(0, newFundPrincipal), loan.fundRate / 100 / 12, remainingMonths)
      } else {
        const commercialMonthlyPayment = calculateEqualInterestPayment(Math.max(0, newCommercialPrincipal), loan.commercialRate / 100 / 12, remainingMonths)
        const fundMonthlyPayment = calculateEqualInterestPayment(Math.max(0, newFundPrincipal), loan.fundRate / 100 / 12, remainingMonths)
        newMonthlyPayment = commercialMonthlyPayment + fundMonthlyPayment
      }

      const newSchedule: PaymentSchedule[] = []
      
      let commercialBalance = Math.max(0, newCommercialPrincipal)
      let fundBalance = Math.max(0, newFundPrincipal)
      
      for (let i = 0; i < remainingMonths; i++) {
        let payment = 0
        let principalPaid = 0
        let interest = 0
        
        if (loan.loanType === 'commercial') {
          interest = commercialBalance * (loan.commercialRate / 100 / 12)
          principalPaid = newMonthlyPayment - interest
          commercialBalance -= principalPaid
          payment = newMonthlyPayment
        } else if (loan.loanType === 'fund') {
          interest = fundBalance * (loan.fundRate / 100 / 12)
          principalPaid = newMonthlyPayment - interest
          fundBalance -= principalPaid
          payment = newMonthlyPayment
        } else {
          const commercialMonthlyPayment = calculateEqualInterestPayment(Math.max(0, newCommercialPrincipal), loan.commercialRate / 100 / 12, remainingMonths)
          const fundMonthlyPayment = calculateEqualInterestPayment(Math.max(0, newFundPrincipal), loan.fundRate / 100 / 12, remainingMonths)
          
          const commercialInterest = commercialBalance * (loan.commercialRate / 100 / 12)
          const commercialPrincipalPaid = commercialMonthlyPayment - commercialInterest
          commercialBalance -= commercialPrincipalPaid
          
          const fundInterest = fundBalance * (loan.fundRate / 100 / 12)
          const fundPrincipalPaid = fundMonthlyPayment - fundInterest
          fundBalance -= fundPrincipalPaid
          
          payment = commercialMonthlyPayment + fundMonthlyPayment
          principalPaid = commercialPrincipalPaid + fundPrincipalPaid
          interest = commercialInterest + fundInterest
        }
        
        newSchedule.push({
          month: atMonth + i + 1,
          payment,
          principal: principalPaid,
          interest,
          balance: Math.max(0, commercialBalance + fundBalance)
        })
      }

      const newTotalPayment = combinedSchedule.slice(0, atMonth).reduce((sum: number, s: PaymentSchedule) => sum + s.payment, 0) +
                            prepayment.amount +
                            newSchedule.reduce((sum: number, s: PaymentSchedule) => sum + s.payment, 0)

      const savings = baseSummary.totalPayment - newTotalPayment

      return {
        newSchedule,
        savings,
        newTotalPayment,
        originalRemainingPayment: combinedSchedule.slice(atMonth).reduce((sum: number, s: PaymentSchedule) => sum + s.payment, 0),
        newMonthlyPayment,
        originalMonthlyPayment: combinedSchedule[atMonth]?.payment || 0,
        monthsSaved: 0
      }
    } else {
      const originalTotalPayment = baseSummary.totalPayment
      const paymentsBefore = combinedSchedule.slice(0, atMonth).reduce((sum: number, s: PaymentSchedule) => sum + s.payment, 0)

      const originalMonthlyPayment = combinedSchedule[atMonth]?.payment || 0

      const beforeCommercial = commercialLoan.schedule[atMonth - 1]
      const beforeFund = fundLoan.schedule[atMonth - 1]
      
      let newCommercialPrincipal = beforeCommercial.balance
      let newFundPrincipal = beforeFund.balance
      
      if (loan.loanType === 'commercial') {
        newCommercialPrincipal = beforeCommercial.balance - prepayment.amount
      } else if (loan.loanType === 'fund') {
        newFundPrincipal = beforeFund.balance - prepayment.amount
      } else {
        const totalBalance = beforeCommercial.balance + beforeFund.balance
        newCommercialPrincipal = beforeCommercial.balance - (prepayment.amount * (beforeCommercial.balance / totalBalance))
        newFundPrincipal = beforeFund.balance - (prepayment.amount * (beforeFund.balance / totalBalance))
      }

      const newSchedule: PaymentSchedule[] = []
      
      let commercialBalance = Math.max(0, newCommercialPrincipal)
      let fundBalance = Math.max(0, newFundPrincipal)
      let month = atMonth

      while ((commercialBalance > 0.01 || fundBalance > 0.01) && month < combinedSchedule.length + atMonth) {
        let payment = 0
        let principalPaid = 0
        let interest = 0
        
        if (loan.loanType === 'commercial') {
          interest = commercialBalance * (loan.commercialRate / 100 / 12)
          principalPaid = Math.min(originalMonthlyPayment - interest, commercialBalance)
          commercialBalance -= principalPaid
          payment = originalMonthlyPayment
        } else if (loan.loanType === 'fund') {
          interest = fundBalance * (loan.fundRate / 100 / 12)
          principalPaid = Math.min(originalMonthlyPayment - interest, fundBalance)
          fundBalance -= principalPaid
          payment = originalMonthlyPayment
        } else {
          const beforeTotalBalance = beforeCommercial.balance + beforeFund.balance
          
          const commercialPayment = originalMonthlyPayment * (beforeCommercial.balance / beforeTotalBalance)
          const commercialInterest = commercialBalance * (loan.commercialRate / 100 / 12)
          const commercialPrincipalPaid = Math.min(commercialPayment - commercialInterest, commercialBalance)
          commercialBalance -= commercialPrincipalPaid
          
          const fundPayment = originalMonthlyPayment * (beforeFund.balance / beforeTotalBalance)
          const fundInterest = fundBalance * (loan.fundRate / 100 / 12)
          const fundPrincipalPaid = Math.min(fundPayment - fundInterest, fundBalance)
          fundBalance -= fundPrincipalPaid
          
          payment = commercialPayment + fundPayment
          principalPaid = commercialPrincipalPaid + fundPrincipalPaid
          interest = commercialInterest + fundInterest
        }
        
        newSchedule.push({
          month: month + 1,
          payment,
          principal: principalPaid,
          interest,
          balance: Math.max(0, commercialBalance + fundBalance)
        })

        month++
      }

      const actualMonthsUsed = newSchedule.length
      const newTotalPayment = paymentsBefore + prepayment.amount + newSchedule.reduce((sum: number, s: PaymentSchedule) => sum + s.payment, 0)
      const monthsSaved = remainingMonths - actualMonthsUsed

      return {
        newSchedule,
        savings: originalTotalPayment - newTotalPayment,
        newTotalPayment,
        originalRemainingPayment: combinedSchedule.slice(atMonth).reduce((sum: number, s: PaymentSchedule) => sum + s.payment, 0),
        newMonthlyPayment: originalMonthlyPayment,
        originalMonthlyPayment: combinedSchedule[atMonth]?.payment || 0,
        monthsSaved
      }
    }
  }, [prepayment.enabled, prepayment.amount, prepayment.atMonth, prepayment.type, combinedSchedule, baseSummary, loan, commercialLoan.schedule, fundLoan.schedule, commercialLoan.totalInterest, fundLoan.totalInterest])

  const refinanceResult = useMemo(() => {
    if (!refinance.enabled) return null

    let totalPrincipal = 0
    let originalRate = 0
    
    if (loan.loanType === 'commercial') {
      totalPrincipal = loan.commercialAmount
      originalRate = loan.commercialRate
    } else if (loan.loanType === 'fund') {
      totalPrincipal = loan.fundAmount
      originalRate = loan.fundRate
    } else {
      totalPrincipal = loan.commercialAmount + loan.fundAmount
      originalRate = (loan.commercialAmount * loan.commercialRate + loan.fundAmount * loan.fundRate) / 
                     (loan.commercialAmount + loan.fundAmount)
    }

    if (refinance.amount <= 0) {
      return {
        monthlySavings: 0,
        totalSavings: 0,
        breakEvenMonths: 0,
        worthIt: false,
        refinanceAmount: 0,
        originalMonthlyPayment: baseSummary.monthlyPayment,
        newOriginalMonthlyPayment: baseSummary.monthlyPayment,
        thirdPartyMonthlyPayment: 0,
        newTotalMonthlyPayment: baseSummary.monthlyPayment,
        remainingOriginalPrincipal: totalPrincipal,
        isZeroAmount: true,
        thirdPartyLoanDescription: '',
        paymentMethod: refinance.paymentMethod,
        actualRepayMonth: 0,
        thirdPartyTotalPayment: 0
      }
    }

    const refinanceAmount = Math.min(refinance.amount, totalPrincipal)
    const remainingOriginalPrincipal = totalPrincipal - refinanceAmount
    
    const monthlyRate = originalRate / 100 / 12
    const newMonthlyRate = refinance.newRate / 100 / 12
    
    const originalMonthlyPayment = baseSummary.monthlyPayment
    
    const newOriginalMonthlyPayment = remainingOriginalPrincipal * monthlyRate * 
                                       Math.pow(1 + monthlyRate, combinedSchedule.length) / 
                                       (Math.pow(1 + monthlyRate, combinedSchedule.length) - 1)
    
    let thirdPartyMonthlyPayment = 0
    let thirdPartyTotalPayment = 0
    let thirdPartyLoanDescription = ''
    const actualRepayMonth = refinance.repayMonth && refinance.repayMonth > 0 ? refinance.repayMonth : refinance.newMonths
    
    if (refinance.paymentMethod === 'equal-principal-interest') {
      thirdPartyMonthlyPayment = refinanceAmount * newMonthlyRate * 
                                  Math.pow(1 + newMonthlyRate, refinance.newMonths) / 
                                  (Math.pow(1 + newMonthlyRate, refinance.newMonths) - 1)
      thirdPartyLoanDescription = refinance.repayMonth && refinance.repayMonth > 0 
                                   ? `等额本息（第${refinance.repayMonth}个月还清）` 
                                   : '等额本息'
      
      if (refinance.repayMonth && refinance.repayMonth > 0) {
        const balance = refinanceAmount * 
                        (Math.pow(1 + newMonthlyRate, refinance.newMonths) - Math.pow(1 + newMonthlyRate, refinance.repayMonth)) /
                        (Math.pow(1 + newMonthlyRate, refinance.newMonths) - 1)
        thirdPartyTotalPayment = thirdPartyMonthlyPayment * refinance.repayMonth + balance
      } else {
        thirdPartyTotalPayment = thirdPartyMonthlyPayment * refinance.newMonths
      }
    } else if (refinance.paymentMethod === 'interest-first') {
      const dailyRate = refinance.newRate / 100 / 365
      const daysPerMonth = 30
      
      if (refinance.averageDailyBalance && refinance.averageDailyBalance > 0) {
        thirdPartyMonthlyPayment = refinance.averageDailyBalance * dailyRate * daysPerMonth
        thirdPartyLoanDescription = refinance.repayMonth && refinance.repayMonth > 0
                                     ? `先息后本（第${refinance.repayMonth}个月还清）`
                                     : '先息后本'
      } else {
        thirdPartyMonthlyPayment = refinanceAmount * dailyRate * daysPerMonth
        thirdPartyLoanDescription = refinance.repayMonth && refinance.repayMonth > 0
                                     ? `先息后本（第${refinance.repayMonth}个月还清）`
                                     : '先息后本'
      }
      thirdPartyTotalPayment = thirdPartyMonthlyPayment * actualRepayMonth + refinanceAmount
    }
    
    const newTotalMonthlyPayment = newOriginalMonthlyPayment + thirdPartyMonthlyPayment
    
    const monthlySavings = originalMonthlyPayment - newTotalMonthlyPayment
    
    const originalTotalPayment = originalMonthlyPayment * combinedSchedule.length
    const newTotalPayment = (newOriginalMonthlyPayment * combinedSchedule.length) + thirdPartyTotalPayment
    
    const totalSavings = originalTotalPayment - newTotalPayment

    return {
      monthlySavings,
      totalSavings,
      breakEvenMonths: 0,
      worthIt: totalSavings > 0,
      refinanceAmount,
      originalMonthlyPayment,
      newOriginalMonthlyPayment,
      thirdPartyMonthlyPayment,
      newTotalMonthlyPayment,
      remainingOriginalPrincipal,
      thirdPartyLoanDescription,
      paymentMethod: refinance.paymentMethod,
      actualRepayMonth,
      thirdPartyTotalPayment
    }
  }, [refinance.enabled, refinance.amount, refinance.newRate, refinance.newMonths, refinance.paymentMethod, refinance.averageDailyBalance, refinance.repayMonth, baseSummary, loan, combinedSchedule.length])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getDisplaySchedule = useMemo(() => {
    if (prepaymentResult?.newSchedule && prepayment.enabled) {
      const beforePrepayment = combinedSchedule.slice(0, prepayment.atMonth)
      return [...beforePrepayment, ...prepaymentResult.newSchedule]
    }
    return combinedSchedule
  }, [prepaymentResult, prepayment.enabled, prepayment.atMonth, combinedSchedule])

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">房贷计算器</h1>
        <p className="text-slate-600 dark:text-slate-400">
          支持商业贷款、公积金贷款组合计算，提前还款分析，贷款置换方案
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-sky-500" />
              贷款配置
            </h2>

            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                贷款类型
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => updateLoan('loanType', 'commercial')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    loan.loanType === 'commercial'
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950'
                  }`}
                >
                  <div className="font-medium text-sm">商业贷款</div>
                </button>
                <button
                  onClick={() => updateLoan('loanType', 'fund')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    loan.loanType === 'fund'
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950'
                  }`}
                >
                  <div className="font-medium text-sm">公积金贷款</div>
                </button>
                <button
                  onClick={() => updateLoan('loanType', 'combined')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    loan.loanType === 'combined'
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950'
                  }`}
                >
                  <div className="font-medium text-sm">组合贷款</div>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {(loan.loanType === 'commercial' || loan.loanType === 'combined') && (
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium mb-4">商业贷款</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        贷款金额（万元）
                      </label>
                      <input
                        type="number"
                        value={loan.commercialAmount / 10000}
                        onChange={(e) => updateLoan('commercialAmount', (parseFloat(e.target.value) || 0) * 10000)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        年利率（%）
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={loan.commercialRate}
                        onChange={(e) => updateLoan('commercialRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        贷款期数（月）
                      </label>
                      <input
                        type="number"
                        value={loan.commercialMonths}
                        onChange={(e) => updateLoan('commercialMonths', parseInt(e.target.value) || 0)}
                        min={1}
                        max={360}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(loan.loanType === 'fund' || loan.loanType === 'combined') && (
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium mb-4">公积金贷款</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        贷款金额（万元）
                      </label>
                      <input
                        type="number"
                        value={loan.fundAmount / 10000}
                        onChange={(e) => updateLoan('fundAmount', (parseFloat(e.target.value) || 0) * 10000)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        年利率（%）
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={loan.fundRate}
                        onChange={(e) => updateLoan('fundRate', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        贷款期数（月）
                      </label>
                      <input
                        type="number"
                        value={loan.fundMonths}
                        onChange={(e) => updateLoan('fundMonths', parseInt(e.target.value) || 0)}
                        min={1}
                        max={360}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  还款方式
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => updateLoan('repaymentType', 'equal-interest')}
                    className={`flex-1 p-3 rounded-lg border text-center transition-colors ${
                      loan.repaymentType === 'equal-interest'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <div className="font-medium text-sm">等额本息</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">每月还款额相同</div>
                  </button>
                  <button
                    onClick={() => updateLoan('repaymentType', 'equal-principal')}
                    className={`flex-1 p-3 rounded-lg border text-center transition-colors ${
                      loan.repaymentType === 'equal-principal'
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <div className="font-medium text-sm">等额本金</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">首月最多，逐月递减</div>
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <button
              onClick={() => toggleSection('prepayment')}
              className="w-full flex items-center justify-between"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-sky-500" />
                提前还款
              </h2>
              {expandedSection === 'prepayment' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {expandedSection === 'prepayment' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    提前还款金额（万元）
                  </label>
                  <input
                    type="number"
                    value={prepayment.amount / 10000}
                    onChange={(e) => updatePrepayment('amount', (parseFloat(e.target.value) || 0) * 10000)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    提前还款期数
                  </label>
                  <input
                    type="number"
                    value={prepayment.atMonth}
                    onChange={(e) => updatePrepayment('atMonth', Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={combinedSchedule.length - 1}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    当前贷款总期数：{combinedSchedule.length} 期（提前还款期数需在 1-{combinedSchedule.length - 1} 之间）
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    还款方式
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updatePrepayment('type', 'reduce-payment')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        prepayment.type === 'reduce-payment'
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950'
                      }`}
                    >
                      <div className="font-medium text-sm">减少月供</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">年限不变，月供减少</div>
                    </button>
                    <button
                      onClick={() => updatePrepayment('type', 'shorten-term')}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        prepayment.type === 'shorten-term'
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950'
                      }`}
                    >
                      <div className="font-medium text-sm">缩短年限</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">月供不变，提前还清</div>
                    </button>
                  </div>
                </div>

                {prepaymentResult && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <h3 className="font-medium text-green-700 dark:text-green-400 mb-2">提前还款效果</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">节省利息：</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{formatCurrency(prepaymentResult.savings)}</span>
                      </div>
                      {prepayment.type === 'reduce-payment' ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">原月供：</span>
                            <span className="font-medium">{formatCurrency(prepaymentResult.originalMonthlyPayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">新月供：</span>
                            <span className="font-medium">{formatCurrency(prepaymentResult.newMonthlyPayment)}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">原剩余期数：</span>
                            <span className="font-medium">{combinedSchedule.length - prepayment.atMonth} 期</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">新剩余期数：</span>
                            <span className="font-medium text-green-600 dark:text-green-400">{prepaymentResult.newSchedule.length} 期</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600 dark:text-slate-400">缩短月数：</span>
                            <span className="font-medium text-green-600 dark:text-green-400">{prepaymentResult.monthsSaved} 个月</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <button
              onClick={() => toggleSection('refinance')}
              className="w-full flex items-center justify-between"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-sky-500" />
                贷款置换分析
              </h2>
              {expandedSection === 'refinance' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {expandedSection === 'refinance' && refinanceResult && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    置换金额（万元）
                  </label>
                  <input
                    type="number"
                    value={refinance.amount / 10000}
                    onChange={(e) => updateRefinance('amount', (parseFloat(e.target.value) || 0) * 10000)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    用三方贷款偿还部分本金，请输入置换金额（万元）
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      年利率（%）
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={refinance.newRate}
                      onChange={(e) => updateRefinance('newRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      贷款期数（月）
                    </label>
                    <input
                      type="number"
                      value={refinance.newMonths}
                      onChange={(e) => updateRefinance('newMonths', parseInt(e.target.value) || 0)}
                      min={1}
                      max={360}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    三方贷款还款方式
                  </label>
                  <select
                    value={refinance.paymentMethod}
                    onChange={(e) => updateRefinance('paymentMethod', e.target.value as 'equal-principal-interest' | 'interest-first')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="equal-principal-interest">等额本息</option>
                    <option value="interest-first">先息后本</option>
                  </select>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {refinance.paymentMethod === 'equal-principal-interest' && '每月还款金额固定，包含本金和利息'}
                    {refinance.paymentMethod === 'interest-first' && '按日计算利息，每月支付利息，到期还本'}
                  </p>
                </div>

                {refinance.paymentMethod === 'interest-first' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      预计日均余额（万元）
                    </label>
                    <input
                      type="number"
                      value={(refinance.averageDailyBalance || 0) / 10000}
                      onChange={(e) => updateRefinance('averageDailyBalance', (parseFloat(e.target.value) || 0) * 10000)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      留空或输入 0 则使用全部置换金额
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    计划第几个月还清（可选）
                  </label>
                  <input
                    type="number"
                    value={refinance.repayMonth || 0}
                    onChange={(e) => updateRefinance('repayMonth', parseInt(e.target.value) || 0)}
                    min={1}
                    max={refinance.newMonths}
                    placeholder="留空或输入 0 表示按期数还清"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    例如：计划在第12个月（一年）时还清全部三方贷款
                  </p>
                </div>

                {refinanceResult && (
                  refinanceResult.isZeroAmount ? (
                    <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                      <h3 className="font-medium mb-2 text-slate-700 dark:text-slate-300">
                        💡 请输入置换金额
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        请输入要置换的贷款金额（万元）来查看分析结果
                      </p>
                    </div>
                  ) : (
                    <div className={`p-4 rounded-lg border ${refinanceResult.worthIt ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                      <h3 className={`font-medium mb-2 ${refinanceResult.worthIt ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        {refinanceResult.worthIt ? '✓ 建议置换' : '✗ 不建议置换'}
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">置换金额：</span>
                          <span className="font-medium">{formatCurrency(refinanceResult.refinanceAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">剩余原贷款：</span>
                          <span className="font-medium">{formatCurrency(refinanceResult.remainingOriginalPrincipal)}</span>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-2">
                          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">月供对比</div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">原月供：</span>
                          <span className="font-medium">{formatCurrency(refinanceResult.originalMonthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">剩余原贷款月供：</span>
                          <span className="font-medium">{formatCurrency(refinanceResult.newOriginalMonthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">三方贷款月供：</span>
                          <span className="font-medium">{formatCurrency(refinanceResult.thirdPartyMonthlyPayment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">贷款类型：</span>
                          <span className="font-medium text-xs">{refinanceResult.thirdPartyLoanDescription}</span>
                        </div>
                        {refinanceResult.actualRepayMonth > 0 && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">计划还款月份：</span>
                              <span className="font-medium">第{refinanceResult.actualRepayMonth}个月</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">三方贷款总还款：</span>
                              <span className="font-medium">{formatCurrency(refinanceResult.thirdPartyTotalPayment)}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-700 dark:text-slate-300">新总月供：</span>
                          <span className={refinanceResult.monthlySavings > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {formatCurrency(refinanceResult.newTotalMonthlyPayment)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">月供变化：</span>
                          <span className={`font-medium ${refinanceResult.monthlySavings > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {refinanceResult.monthlySavings > 0 ? '节省 ' : '增加 '}{formatCurrency(Math.abs(refinanceResult.monthlySavings))}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">总节省：</span>
                          <span className={`font-medium ${refinanceResult.totalSavings > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatCurrency(refinanceResult.totalSavings)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-sky-500" />
              计算结果
            </h2>

            <div className="space-y-4">
              <div className="p-3 rounded bg-sky-50 dark:bg-sky-900/20">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">月供</div>
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                  {formatCurrency(baseSummary.monthlyPayment)}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">贷款总额</span>
                  <span className="font-medium">{formatCurrency(baseSummary.totalLoan)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">还款总额</span>
                  <span className="font-medium">{formatCurrency(baseSummary.totalPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">支付利息</span>
                  <span className="font-medium text-red-600 dark:text-red-400">{formatCurrency(baseSummary.totalInterest)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">贷款构成</h2>
            <div className="space-y-3 text-sm">
              {loan.loanType !== 'fund' && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600 dark:text-slate-400">商业贷款</span>
                    <span className="font-medium">{formatCurrency(loan.commercialAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-500 text-xs">月供</span>
                    <span className="text-xs">{formatCurrency(commercialLoan.schedule[0]?.payment || 0)}</span>
                  </div>
                </div>
              )}
              {loan.loanType !== 'commercial' && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600 dark:text-slate-400">公积金贷款</span>
                    <span className="font-medium">{formatCurrency(loan.fundAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-500 text-xs">月供</span>
                    <span className="text-xs">{formatCurrency(fundLoan.schedule[0]?.payment || 0)}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">使用提示</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                <strong>提示：</strong>等额本金总利息更少，但前期月供更高！
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>提前还款可显著减少利息</li>
                <li>选择缩短年限更省利息</li>
                <li>置换需考虑手续费成本</li>
                <li>公积金利率通常更低</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold mb-4">还款计划表</h2>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white dark:bg-slate-950">
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3">期数</th>
                <th className="text-right py-2 px-3">月供</th>
                <th className="text-right py-2 px-3">本金</th>
                <th className="text-right py-2 px-3">利息</th>
                <th className="text-right py-2 px-3">剩余本金</th>
              </tr>
            </thead>
            <tbody>
              {getDisplaySchedule.map((item) => (
                <tr
                  key={item.month}
                  className={prepayment.enabled && item.month === prepayment.atMonth ? 'bg-green-50 dark:bg-green-900/20' : 'border-b border-slate-100 dark:border-slate-800'}
                >
                  <td className="py-2 px-3">{item.month}</td>
                  <td className="text-right py-2 px-3">{formatCurrency(item.payment)}</td>
                  <td className="text-right py-2 px-3">{formatCurrency(item.principal)}</td>
                  <td className="text-right py-2 px-3">{formatCurrency(item.interest)}</td>
                  <td className="text-right py-2 px-3">{formatCurrency(item.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
