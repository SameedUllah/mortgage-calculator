import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/logo.webp";
import {
  Layout,
  Col,
  Row,
  Typography,
  Form,
  // Input,
  Slider,
  Select,
  Radio,
  Table,
  Divider,
  InputNumber,
} from "antd";
import {
  formStyles,
  rowStyles,
  summaryStyles,
  labelStyles,
  rowMTStyles,
} from "./styles/styles";
const { Option } = Select;

const App: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number | undefined>(0);
  const [interestRate, setInterestRate] = useState<number>(8);
  const [loanDurationMonths, setLoanDurationMonths] = useState<number>(1);
  const [loanDurationYears, setLoanDurationYears] = useState<number>(1);
  const [processingFees, setProcessingFees] = useState<number | undefined>(
    undefined
  );
  const [currency, setCurrency] = useState<string>("EUR");
  const [accrualFrequency, setAccrualFrequency] = useState<string>("monthly");
  const [repaymentType, setRepaymentType] = useState<string>("fixed");
  const [startingMonth, setStartingMonth] = useState<string>("January");

  // cases for monthly/yearly -- APR = interest in monthly -- Remaining = original - the principal
  //original amount from last row Remaining
  //processing fee ?
  //seperators
  const calculateAPR = () => {
    const apr = interestRate;
    return apr.toFixed(2);
  };

  const calculateAPY = () => {
    const n = loanDurationMonths / 12;
    const apy = Math.pow(1 + interestRate / 100 / n, n) - 1;
    return (apy * 100).toFixed(2);
  };

  const calculateMonthlyInstallment = () => {
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = loanDurationMonths;
    const factor = Math.pow(1 + monthlyInterestRate, totalPayments);
    const monthlyPayment =
      (loanAmount! * monthlyInterestRate * factor) / (factor - 1);

    return monthlyPayment;
  };

  const generateRepaymentSchedule = () => {
    const scheduleData = [];
    let remainingAmount = loanAmount!;

    const startingMonthDate = new Date(2023, parseInt(startingMonth));

    const monthlyInstallment = calculateMonthlyInstallment();

    for (let i = 0; i < loanDurationMonths; i++) {
      const currentDate = new Date(
        startingMonthDate.getFullYear(),
        startingMonthDate.getMonth() + i
      );
      const interestPayment = (remainingAmount * interestRate) / 100 / 12;
      const principalPayment = monthlyInstallment - interestPayment;

      const payable = monthlyInstallment
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");

      const remaining =
        i === 0
          ? remainingAmount
          : (remainingAmount - principalPayment)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,");

      let startingAmount = remainingAmount;

      scheduleData.push({
        nr: i + 1,
        month: currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        startingAmount,
        payable,
        interest: interestPayment.toFixed(2),
        principal: principalPayment
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, "$&,"),
        remaining,
      });

      remainingAmount -= principalPayment;
    }

    return scheduleData;
  };

  const repaymentColumns = [
    {
      title: "Nr.",
      dataIndex: "nr",
      key: "nr",
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Starting Amount",
      dataIndex: "startingAmount",
      key: "startingAmount",
    },
    {
      title: "Interest",
      dataIndex: "interest",
      key: "interest",
    },
    {
      title: "Principal",
      dataIndex: "principal",
      key: "principal",
    },

    {
      title: "Payable",
      dataIndex: "payable",
      key: "payable",
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      key: "remaining",
    },
  ];

  useEffect(() => {}, [
    loanAmount,
    interestRate,
    loanDurationMonths,
    processingFees,
    currency,
  ]);

  return (
    <div>
      <div
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          margin: "3rem 0",
        }}
      >
        <a href="#">
          <img src={logo} width={320} alt="logo" />
        </a>
      </div>
      <Layout
        style={{
          backgroundColor: "#fefefe",
          padding: "2rem",
          minHeight: "100vh",
        }}
        className="layout"
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 1rem 0 0rem",
          }}
        >
          <Typography.Title>Loan Calculator</Typography.Title>

          <Form.Item colon={false} style={labelStyles} label="Language">
            <Select defaultValue="ENG">
              <Option value="ENG">ENG</Option>
              <Option value="GER">GER</Option>
            </Select>
          </Form.Item>
        </div>
        <Row style={rowMTStyles}>
          <Col span={14}>
            <Form style={formStyles}>
              <Row style={rowStyles}>
                <Col span={10}>
                  <Form.Item colon={false} style={labelStyles} label="Currency">
                    <Select
                      defaultValue="EUR"
                      onChange={(value) => setCurrency(value as string)}
                    >
                      <Option value="USD">USD</Option>
                      <Option value="EUR">EUR</Option>
                      <Option value="GBP">GBP</Option>
                      <Option value="CHF">CHF</Option>
                      <Option value="SEK">SEK</Option>
                      <Option value="NOK">NOK</Option>
                      <Option value="JPY">JPY</Option>
                      <Option value="CNY">CNY</Option>
                      <Option value="HKD">HKD</Option>
                      <Option value="SGD">SGD</Option>
                      <Option value="AUD">AUD</Option>
                      <Option value="NZD">NZD</Option>
                      <Option value="ZAR">ZAR</Option>
                      <Option value="AED">AED</Option>
                      <Option value="CAD">CAD</Option>
                      <Option value="BRL">BRL</Option>
                      <Option value="RUR">RUR</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    colon={false}
                    style={labelStyles}
                    label="Starting month"
                  >
                    <Select
                      defaultValue="Select"
                      onChange={(value) => setStartingMonth(value as string)}
                    >
                      {Array.from({ length: 12 }).map((_, index) => {
                        const today = new Date();
                        const nextMonth = new Date(
                          today.getFullYear(),
                          today.getMonth() + index + 1
                        );
                        const month = nextMonth.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        });
                        return (
                          <Option
                            key={index}
                            value={(today.getMonth() + index + 2).toString()}
                          >
                            {month}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row style={rowStyles}>
                <Col span={10}>
                  <Form.Item
                    label={`Loan Amount (${currency})`}
                    colon={false}
                    style={labelStyles}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value: any) => value!.replace(/\$\s?|(,*)/g, "")}
                      onChange={(e) => setLoanAmount(parseFloat(e))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    colon={false}
                    style={labelStyles}
                    label={`Processing Fee (${currency})`}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value: any) => value!.replace(/\$\s?|(,*)/g, "")}
                      onChange={(e) =>
                        setProcessingFees(parseFloat(e?.target?.value))
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={rowStyles}>
                <Col span={12}>
                  <Form.Item
                    colon={false}
                    style={labelStyles}
                    label="Interest Rate (Max 24%)"
                  >
                    <div
                      style={{ display: "flex", gap: "1rem", width: "100%" }}
                    >
                      <Slider
                        min={1}
                        max={24}
                        step={0.5}
                        value={interestRate}
                        onChange={(value) => setInterestRate(value as number)}
                        style={{ width: "90%" }}
                      />
                      <InputNumber
                        min={1}
                        max={240}
                        style={{ margin: "0 16px" }}
                        value={interestRate}
                      />
                    </div>
                  </Form.Item>
                </Col>
                <Col
                  span={10}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ marginTop: "8px", fontWeight: "400" }}>
                      APR: {calculateAPR()}%
                    </div>
                    <div style={{ marginTop: "8px", fontWeight: "400" }}>
                      APY: {calculateAPY()}%
                    </div>
                  </div>
                </Col>
              </Row>
              <Row style={rowStyles}>
                <Col span={12}>
                  <Form.Item label="Duration (Months)" style={labelStyles}>
                    <Slider
                      min={1}
                      max={120}
                      defaultValue={loanDurationMonths}
                      onChange={(value) => {
                        setLoanDurationMonths(value as number);
                        setLoanDurationYears(value / 12);
                      }}
                      value={loanDurationMonths}
                    />
                  </Form.Item>
                </Col>

                <Col span={10}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Form.Item label="Months" style={labelStyles}>
                      <InputNumber
                        min={1}
                        max={120}
                        style={{ margin: "0 16px" }}
                        value={loanDurationMonths.toFixed(0)}
                        onChange={(value: any) => {
                          setLoanDurationMonths(value as number);
                          setLoanDurationYears(value / 12);
                        }}
                      />
                    </Form.Item>
                    <Form.Item label="Years" style={labelStyles}>
                      <InputNumber
                        min={0.1}
                        max={10}
                        step={0.1}
                        style={{ margin: "0 16px" }}
                        value={loanDurationYears.toFixed(1)}
                        onChange={(value: any) => {
                          setLoanDurationMonths(value * 12);
                          setLoanDurationYears(value as number);
                        }}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row style={rowStyles}>
                <Col span={11}>
                  <Form.Item
                    colon={false}
                    style={labelStyles}
                    label="Repayment Type"
                  >
                    <Radio.Group
                      style={{ fontWeight: "400" }}
                      onChange={(e) => setRepaymentType(e.target.value)}
                      value={repaymentType}
                    >
                      <Radio value="fixed">Fixed Monthly</Radio>
                      <Radio value="dynamic">Dynamic</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    colon={false}
                    style={labelStyles}
                    label="Accrual of Interest"
                  >
                    <Radio.Group
                      style={{ fontWeight: "400" }}
                      onChange={(e) => setAccrualFrequency(e.target.value)}
                      value={accrualFrequency}
                    >
                      <Radio value="monthly">Monthly</Radio>
                      <Radio value="annually">Annually</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={10} style={summaryStyles}>
            <Typography.Title style={{ fontSize: "4rem", lineHeight: "0.2" }}>
              {currency}{" "}
              {calculateMonthlyInstallment()
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
            </Typography.Title>
            <Typography.Title
              level={2}
              style={{ opacity: "0.5", fontWeight: "400" }}
            >
              Monthly Payment
            </Typography.Title>
            <Col>
              <Row style={{ justifyContent: "space-between" }}>
                <Typography.Title level={3} style={{ fontWeight: 400 }}>
                  Interest Rate
                </Typography.Title>
                <Typography.Title level={3} style={{ fontWeight: 400 }}>
                  {interestRate} %
                </Typography.Title>
              </Row>
              <Divider style={{ margin: "8px 0" }} />
              <Row style={{ justifyContent: "space-between" }}>
                <Typography.Title level={3} style={{ fontWeight: 400 }}>
                  Time
                </Typography.Title>
                <Typography.Title level={3} style={{ fontWeight: 400 }}>
                  {loanDurationMonths.toFixed(0)} months
                </Typography.Title>
              </Row>
            </Col>
          </Col>
        </Row>
        <Row style={{ marginTop: "1rem" }}>
          <Col span={24}>
            <Typography.Title level={4}>Repayment Schedule</Typography.Title>
            <Table
              dataSource={generateRepaymentSchedule()}
              columns={repaymentColumns}
              pagination={false}
            />
          </Col>
        </Row>
      </Layout>
    </div>
  );
};

export default App;
