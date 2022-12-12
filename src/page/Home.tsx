/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useEffect, useState } from "react";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  FormFeedback,
  Input,
  Label,
  Row,
  Table,
} from "reactstrap";

import * as Yup from "yup";
import useAuth from "../hooks/useAuth";
import useTodo from "../hooks/useTodo";
import ApiService from "../services/api";
import { Todo } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTrash,
  faArrowLeft,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Swal from "sweetalert2";

const TableCell = styled.td`
  vertical-align: middle !important;
  min-width: 90px;
`;

const FAB = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1.5;
  padding: 0;
  z-index: 100;
`;

type FormValues = {
  title: string;
  deadline: string;
};

const initialValues: FormValues = {
  title: "",
  deadline: "",
};


// TODO: Deixe o campo deadline com uma mensagem de "Data inválida"
// TODO: Valide se o campo deadline é maior ou igual a data atual

const FormSchema = Yup.object().shape({
  title: Yup.string().required("O Título Obrigatorio"),
  deadline: Yup.string(),
});

// TODO: Após deletar e atualizar, atualize a lista de tarefas

const Home = () => {
  const { user } = useAuth();
  const { todos, setTodos } = useTodo();

  // TODO: Troque a lógica abaixo por lógica usando o useMemo
  // ---------- Inicio da lógica a ser trocada ----------
  const [search, setSearch] = useState<string>("");
  const [filteredTodo, setFilteredTodo] = useState<Todo[]>([]);
  const [filteredDone, setFilteredDone] = useState<Todo[]>([]);

  const filterData = () => {
    // TODO: Utilize o filter para filtrar as tarefas
    const filteredData = [];

    todos.filter((todo) => {
      if (todo.title.toLowerCase().includes(search.toLowerCase())) {
        filteredData.push(todo);
      }
    });

    // TODO: Utilize o map para verificar se a tarefa está atrasada ou não e adicionar a propriedade late
    const mappedData = filteredData.map((todo) => todo);


    const todo = [];
    const done = [];

    mappedData.filter((_todo) => {
      if (_todo.done === true) {
        done.push(_todo);
      } else {
        todo.push(_todo);
      }
    });

    setFilteredTodo(todo);
    setFilteredDone(done);
  };

  useEffect(() => {
    filterData();
  }, [todos, search]);

  // ---------- Fim da lógica a ser trocada ----------

  // TODO: Crie a lógica da formatação da data para o formato dd/mm/yyyy, utilize split, reverse e join
  const formatDate = (date: string) => {
   
   
    return date;
  };

  const fetchData = async () => {
    try {
      const { data } = await ApiService.HttpGet({
        route: `/users/${user.id}/todo`,
      });

      // TODO: Deixe em ordem crescente pelo campo deadline
      const sortedData = data;

      setTodos(sortedData);
    } catch (error) {
      console.log(error);
      toast.error("Erro ao buscar dados");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Exiba um modal de confirmação antes de deletar usando SweetAlert2

      await ApiService.HttpDelete({
        route: `/users/${user.id}/todo/${id}`,
      });

      toast.success("Tarefa deletada com sucesso");
    } catch (error) {
      console.log(error);
      toast.error("Erro ao deletar tarefa");
    }
  };

  const handleUpdate = async (id: string, completed: boolean) => {
    try {
      await Swal.fire({
        title: "Tem certeza?",
        text: "Você irá atualizar o status da tarefa!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, atualizar!",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          return ApiService.HttpPut({
            route: `/users/${user.id}/todo/${id}`,
            body: {
              completed,
            },
          })
            .then(() => {
              Swal.fire(
                "Atualizado!",
                "Seu registro foi atualizado.",
                "success"
              );
            })
            .catch((error) => {
              Swal.fire({
                title: "Erro!",
                text: `Erro ao atualizar tarefa! ${error}`,
                icon: "error",
                confirmButtonText: "Ok",
              });
            });
        },
        showLoaderOnConfirm: true,
      });
    } catch (error) {
      console.log(error);
      toast.error("Erro ao atualizar tarefa");
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleFormSubmit = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) => {
    helpers.setSubmitting(true);

    try {
      await ApiService.HttpPost({
        route: `/users/${user.id}/todo`,
        body: { ...values, userId: user.id, completed: false },
      });

      toast.success("Tarefa criada com sucesso");

      fetchData();
      helpers.resetForm();
    } catch (e) {
      toast.error("Erro ao criar tarefa");
    }

    helpers.setSubmitting(false);
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="bg-dark">
      <div className="animate__animated animate__fadeIn">
        <Container className="min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <Card style={{ maxWidth: 800 }} className="w-100 mb-5 mt-5">
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
                <Form onSubmit={handleSubmit}>
                  <CardHeader>
                    <h5 className="text-center m-0">Criar nova tarefa</h5>
                  </CardHeader>
                  <CardBody>
                    <Row className="align-items-start">
                      <Col xs={12} md={8}>
                        <Label className="form-label fs-6 fw-bolder text-dark">
                          Usuário
                        </Label>
                        <Input
                          className="form-control-solid"
                          name="title"
                          type="text"
                          value={values.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.title ? !!errors.title : undefined}
                          valid={touched.title && !errors.title}
                          placeholder="Digite o título"
                        />
                        {errors.title && (
                          <FormFeedback>{errors.title}</FormFeedback>
                        )}
                      </Col>

                   
                      <Col xs={12} md={4}>
                        <Label className="form-label fs-6 fw-bolder text-dark">
                          Data
                        </Label>
                        <Input
                          className="form-control-solid"
                          name="deadline"
                          type="date"
                          value={values.deadline}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={
                            touched.deadline ? !!errors.deadline : undefined
                          }
                          valid={touched.deadline && !errors.deadline}
                          placeholder="Selecione a data"
                          min={new Date().toISOString().split("T")[0]}
                        />
                        {errors.deadline && (
                          <FormFeedback>{errors.deadline}</FormFeedback>
                        )}
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <Row className="justify-content-end">
                      <Col xs={12} md={3}>
                        <Button type="submit" color="primary" className="w-100">
                          Nova tarefa
                        </Button>
                      </Col>
                    </Row>
                  </CardFooter>
                </Form>
              )}
            </Formik>
          </Card>

          <Card style={{ maxWidth: 800 }} className="w-100 mb-1">
            <CardHeader>
              <h5 className="text-center m-0">Busca</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs={12}>
                  <Input
                    name="title"
                    type="text"
                    placeholder="Digite aqui sua busca"
                    value={search}
                    onChange={ (e) => setSearch(e.target.value)}
                  />
                </Col>
              </Row>
            </CardBody>

            <CardHeader>
              <h5 className="text-center m-0">Tarefas a fazer</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col xs={12}>
                  <Table>
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Data</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTodo.map((todo) => (
                        <tr key={todo.id}>
                          <TableCell>{todo.title}</TableCell>
                          <TableCell>{formatDate(todo.deadline)}</TableCell>
                          <TableCell>
                            {/* TODO: Corrija a lógica de atualização */}
                            <Button
                              color="success"
                              className="me-2"
                              size="sm"
                              onClick={() => handleUpdate("1", false)}
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDelete(todo.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </CardBody>

            <CardHeader className="border-top">
              <h5 className="text-center m-0">Tarefas concluidas</h5>
            </CardHeader>

            <CardBody>
              <Row>
                <Col xs={12}>
                  <Table>
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Data</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* TODO: Corrija a listagem de tarefas concluidas */}
                      {[].map((todo) => (
                        <tr key={todo.id}>
                          <TableCell>{todo.title}</TableCell>
                          <TableCell>{todo.deadline}</TableCell>
                          <TableCell>
                            {/* TODO: Corrija a lógica de atualização */}
                            <Button
                              color="warning"
                              className="me-2"
                              size="sm"
                              onClick={() => handleUpdate("1", true)}
                            >
                              <FontAwesomeIcon icon={faArrowLeft} />
                            </Button>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleDelete(todo.id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>

        <FAB color="danger">
          <FontAwesomeIcon
            icon={faSignOut}
            type="button"
            onClick={() => logout()}
          />
        </FAB>
      </div>
    </div>
  );
};

export default Home;
