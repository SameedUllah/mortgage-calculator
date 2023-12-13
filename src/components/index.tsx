import { Col, Form, Grid, Layout, Row, Space } from "antd";
import React from "react";

function index() {
  return (
    <Layout>
      <Space>
        <Grid>
          <Row>
            <Col>
              <Form>
                <Form.Item>
                  <label>Name:</label>
                  <input type="text" id="name" />
                </Form.Item>
                <Form.Item>
                  <label>Email:</label>
                  <input type="email" id="email" />
                </Form.Item>
                <Form.Item>
                  <label>Password:</label>
                  <input type="password" id="pwd1" />
                </Form.Item>
                <Form.Item>
                  <label>Confirm Password:</label>
                  <input type="password" id="pwd2" />
                </Form.Item>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    let name = document.getElementById("name").value;
                    let email = document.getElementById("email").value;
                    let pwd1 = document.getElementById("pwd1").value;
                    let pwd2 = document.getElementById("pwd2").value;
                    if (pwd1 === pwd2) {
                      alert("Passwords match");
                    } else {
                      alert("Passwords do not match");
                    }
                  }}
                >
                  Submit
                </button>
              </Form>
            </Col>
          </Row>
        </Grid>
      </Space>
    </Layout>
  );
}

export default index;
