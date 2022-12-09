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
import LoginLottie from "../lotties/login.json";
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

// TODO: Deixe os campos obrigatórios com uma mensagem o "<Campo> é obrigatório"
const FormSchema = Yup.object().shape({
  username: Yup.string(),
  password: Yup.string(),
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
    <div className="bg-dark d-none">
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
              <Card style={{ width: "100%", maxWidth: 800 }}>
                <CardBody>
                  <Row className="align-items-center">
                    {/* TODO: Deixe os blocos lado a lado a partir do tamanho MD */}

                    <Col xs={12} className="d-none d-md-flex">
                      <Lottie
                        options={{
                          loop: true,
                          autoplay: true,
                          animationData: LoginLottie,
                          rendererSettings: {
                            preserveAspectRatio: "xMidYMid slice",
                          },
                        }}
                      />
                    </Col>

                    <Col xs={12}>
                      <Form onSubmit={handleSubmit}>
                        <h4 className="mb-3">
                          <strong>Logue-se</strong>
                        </h4>

                        {/* TODO: Adicione as mensagens de feedback nos inputs com o component <FormFeedback/> */}
                        {/* TODO: Adicione margin bottom entre os inputs utilizando as classes do Bootstrap */}
                        <FormGroup className="w-50">
                          <Label className="form-label fs-6 fw-bolder text-dark">
                            Usuário
                          </Label>
                          <Input
                            className=" form-control-solid"
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
                        </FormGroup>

                        <FormGroup className="w-25">
                          <Label className="form-label fs-6 fw-bolder text-dark">
                            Senha
                          </Label>
                          <Input
                            className=" form-control-solid"
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
                        </FormGroup>

                        <div className="text-center text-lg-start mt-4 pt-2">
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
