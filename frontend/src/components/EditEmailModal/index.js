import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import api from "../../services/api";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
  } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginRight: theme.spacing(1),
    flex: 1,
  },
  extraAttr: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));


const EditModalCampaign = ({ open, onClose, company, emailInfo, setEmails }) => {
  const initialFormState = {
    name: (emailInfo && emailInfo.name) || '',
    title: (emailInfo && emailInfo.title) || null,
    description: (emailInfo && emailInfo.description) || null,
    from: (emailInfo && emailInfo.from) || null,
    contactListId: (emailInfo && emailInfo.contactListId) || null,
    templateId: (emailInfo && emailInfo.templateId) || null,
    companyId: company || null,
  };
  
    const [contactList, setContactList] = useState([]);
    const [user, setUser] = useState(null);
    const [templateList, setTemplateList] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [pageNumber, setPageNumber] = useState(1);
    const [searchParam, setSearchParam] = useState("");
  
    const classes = useStyles();
  
    const handleClose = () => {
      onClose();
    };
  
    const handleEdit = async (values) => {
      try {
        console.log(emailInfo)
        console.log(values)
        
        const response = await api.put(`/email/${emailInfo.id}`, values);
        if (response.status === 200) {
          toast.success(`Campanha de e-mail editada com sucesso`);
          handleClose();
          const fetchData = async () => {
            const { data } = await api.get("/emails", {
              params: { searchParam, pageNumber },
            });
            setEmails(data.email);
          };
          fetchData();
          onClose();
        }

      } catch (err) {
        toastError(err);
      }
    };
  
    useEffect(() => {
      const fetchContactList = async () => {
        try {
          const { data } = await api.get(`/contact-lists`);
          setContactList(data.records);
        } catch (err) {
          toastError(err);
        }
      };
  
      fetchContactList();
    }, []);


    useEffect(() => {
      const fetchTemplateList = async () => {
        try { 
          const { data } = await api.get(`/templates`);
          setTemplateList(data.templates); 
        } catch (err) {
          toastError(err);
        }
      };
  
      fetchTemplateList();
    }, []);
  
    useEffect(() => {
      const fetchEmailUser = async () => {
        try {
          const { data } = await api.get(`/users/${userId}`);
          setUser(data);
        } catch (err) {
          toastError(err);
        }
      };
  
      fetchEmailUser();
    }, []);


  return (
    <div className={classes.root}>

      <Dialog
        maxWidth="sm"
        fullWidth={true}
        open={open}
        onClose={handleClose}
        scroll="paper"
      >
        <DialogTitle id="form-dialog-title">
          Editar Campanha
        </DialogTitle>
        <Formik
          initialValues={initialFormState}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            setTimeout(() => {
                handleEdit(values);
            }, 400);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <Field
                  as={TextField}
                  label="Editar campanha"
                  name="name"
                  helperText={touched.text && errors.text}
                  variant="outlined"
                  margin="dense"
                  style={{ width: '100%', marginBottom: 10 }}
                />

                <Field
                  as={TextField}
                  label="Título"
                  name="title"
                  helperText={touched.text && errors.text}
                  variant="outlined"
                  margin="dense"
                  style={{ width: '100%', marginBottom: 10 }}
                />

                <Field
                  as={TextField}
                  label="Descrição"
                  name="description"
                  helperText={touched.text && errors.text}
                  variant="outlined"
                  margin="dense"
                  style={{ width: '100%', marginBottom: 10 }}
                />
<Field
  as={Select}
  label="Selecione o remetente"
  name="from"
  variant="outlined"
  margin="dense"
  style={{ width: '100%', marginBottom: 10 }}
  displayEmpty
>
  <MenuItem value={null} disabled>
    Selecione o remetente
  </MenuItem>
  <MenuItem key={user.id} value={user.id}>
    {user.email}
  </MenuItem>
</Field>

<Field
  as={Select}
  label="Selecione a lista de destinatários"
  name="contactListId"
  variant="outlined"
  margin="dense"
  style={{ width: '100%', marginBottom: 10 }}
  displayEmpty
>
  <MenuItem value={null} disabled>
    Selecione a lista de destinatários
  </MenuItem>
  {contactList.map((list) => (
    <MenuItem key={list.id} value={list.id}>
      {list.name}
    </MenuItem>
  ))}
</Field>

<Field
  as={Select}
  label="Selecione o template"
  name="templateId"
  variant="outlined"
  margin="dense"
  style={{ width: '100%', marginBottom: 10 }}
  displayEmpty
>
<MenuItem value={null} disabled>
    Selecione o template
  </MenuItem>
{templateList.map((template) => (
  <MenuItem key={template.id} value={template.id}>
    {template.name}
  </MenuItem>
))}
  {/* Adicione seus templates aqui */}
</Field>

              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  variant="outlined"
                >
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  className={classes.btnWrapper}
                >
                  ADICIONAR
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default EditModalCampaign;
