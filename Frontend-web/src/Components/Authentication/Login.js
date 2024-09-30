import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Grid, Input, theme, Typography, ConfigProvider } from "antd";

import { LockOutlined, MailOutlined } from "@ant-design/icons";

const { defaultAlgorithm, darkAlgorithm, getDesignToken } = theme;

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function App({ element }) {
  const navigate = useNavigate()
  const { token } = useToken();
  const screens = useBreakpoint();

  const DarkToken = getDesignToken({
    algorithm: darkAlgorithm
  });

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const styles = {
    container: {
      margin: "0 auto",
      // padding: screens.md ? `${DarkToken.paddingXL}px` : `${DarkToken.sizeXXL}px ${DarkToken.padding}px`,
      width: "380px"
    },
    footer: {
      marginTop: DarkToken.marginLG,
      textAlign: "center",
      width: "100%"
    },
    forgotPassword: {
      float: "right"
    },
    header: {
      marginBottom: DarkToken.marginXL
    },
    section: {
      alignItems: "center",
      // backgroundColor: DarkToken.colorBgContainer,
      display: "flex",
      height: screens.sm ? "70vh" : 'auto',
      // padding: screens.md ? `${DarkToken.sizeXXL}px 0px` : "0px"
    },
    text: {
      // color: DarkToken.colorTextSecondary
    },
    title: {
      fontSize: screens.md ? DarkToken.fontSizeHeading2 : DarkToken.fontSizeHeading3
    }
  };

  return (
    <ConfigProvider theme={element}>
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.464294" width="24" height="24" rx="4.8" fill="#1890FF" />
            <path
              d="M14.8643 3.6001H20.8643V9.6001H14.8643V3.6001Z"
              fill="white"
            />
            <path
              d="M10.0643 9.6001H14.8643V14.4001H10.0643V9.6001Z"
              fill="white"
            />
            <path
              d="M4.06427 13.2001H11.2643V20.4001H4.06427V13.2001Z"
              fill="white"
            />
          </svg>

          <Title style={styles.title}>Sign in</Title>
          <Text style={styles.text}>
            Welcome back to AntBlocks UI! Please enter your details below to
            sign in.
          </Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a style={styles.forgotPassword} href="">
              Forgot password?
            </a>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button onClick={() => navigate("/menu")} block="true" type="primary" htmlType="submit">
              Log in
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text}>Don't have an account?</Text>{" "}
              <Link href="">Sign up now</Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
    </ConfigProvider>
  );
}