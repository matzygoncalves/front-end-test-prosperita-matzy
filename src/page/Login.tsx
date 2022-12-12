import React from "react";

import {
  Col,
  Container,
  Input,
  Label,
  Row,
  FormGroup,
  FormFeedback,
  Button,
  Card,
  CardBody,
} from "reactstrap";
import Lottie from "react-lottie";
import LottieLogin from "../lotties/login.json";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import * as Yup from "yup";
import ApiService from "../services/api";
import { User } from "../types";
import useAuth from "../hooks/useAuth";

type FormValues = {
  username: string;
  password: string;
};

const initialValues: FormValues = {
  username: "",
  password: "",
};


const FormSchema = Yup.object().shape({
  username: Yup.string().required("Nome de usuário obrigatório"),
  password: Yup.string().required("Senha obrigatória"),
});

const Login = () => {
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const handleFormSubmit = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    helpers.setSubmitting(true);

    try {
      const { data } = await ApiService.HttpGet<User[]>({
        route: "/users",
        params: values,
      });

      let user = undefined;

      if (data.length > 0) {
        user = data.find((user) => {
          return (
            user.username === values.username &&
            user.password === values.password
          );
        });
      }

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        toast.info("Logado com sucesso, redirecionando...");

        navigate("/app");
      } else {
        throw new Error("Usuário e/ou senha inválidos");
      }
    } catch (e) {
      toast.error("Usuário e/ou senha inválidos");
      helpers.setErrors({
        username: "Usuário e/ou senha inválidos",
        password: "Usuário e/ou senha inválidos",
      });
    }

    helpers.setSubmitting(false);
  };

  // TODO: Corrija o layout

  return (
    <div className="bg-dark">
      <div className="animate__animated animate__fadeIn">
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={FormSchema}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }: FormikProps<FormValues>) => (
            <Container className="min-vh-100 d-flex align-items-center justify-content-center">
              <Card style={{ width: "50%", maxWidth: 800, minWidth:500}}>
                <CardBody className=" d-md-flex flex-md-row ">
                  <Row>
                    <Col xs={12} md={6} className="d-block d-md-flex">
                      <Lottie
                        options={{
                          loop: true,
                          autoplay: true,
                          animationData: LottieLogin,
                          rendererSettings: {
                            preserveAspectRatio: "xMidYMid slice",
                          },
                        }}
                      />
                    </Col>

                    <Col xs={12} md={6}>
                      <Form className="d-flex flex-column align-items-center justify-content-center" onSubmit={handleSubmit}>
                        <h4 className="mb-3">
                          <strong>Entrar</strong>
                        </h4>

                     
                        <FormGroup className="w-50">
                          <Label className="form-label fs-6 fw-bolder text-dark">
                            Usuário
                          </Label>
                          <Input
                            className="form-control-solid mb-2"
                            name="username"
                            type="text"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={
                              touched.username ? !!errors.username : undefined
                            }
                            valid={touched.username && !errors.username}
                            placeholder="Digite seu usuário"
                          />
                           {errors.username && (
                            <FormFeedback>{errors.username}</FormFeedback>
                          )}
                        </FormGroup>

                        <FormGroup className="w-50">
                          <Label className="form-label fs-6 fw-bolder text-dark">
                            Senha
                          </Label>
                          <Input
                          className=" form-control-solid mb-2"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={
                              touched.password ? !!errors.password : undefined
                            }
                            valid={touched.password && !errors.password}
                            placeholder="Digite sua senha"
                          />
                           {errors.password && (
                            <FormFeedback>{errors.password}</FormFeedback>
                          )}
                        </FormGroup>

                        <div className="text-center text-lg-center mt-2 pt-2">
                          {/* TODO: Adicione uma mensagem de carregando no botão utilizando a variavel isSubmitting */}
                          {/* TODO: Faça o botão de login ficar desabilitado enquanto o formulário não for válido */}
                          <Button type="submit" color="primary">
                            Acessar
                          </Button>
                          <p className="small fw-bold mt-2 pt-1 mb-0">
                            Não possui conta?{" "}
                            <Link to="/register" className="link-danger">
                              Registrar-se
                            </Link>
                          </p>
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Container>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
