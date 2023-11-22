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
import { i18n } from "../../translate/i18n"
import toastError from "../../errors/toastError";

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


const CreateTemplateModal = ({ open, onClose, company, data }) => {

    const [templateForm, setTemplateForm] = useState({
        templateName: "",
        company: company,
        template: null,
        templateHtml: null,
      });
    
  
    const classes = useStyles();
  
    const handleClose = () => {
      onClose();
    };
  
    const handleSaveEmail = async (values) => {
  
      const saveTemplate = async () => {
        try {
          const response = await api.post('/saveTemplate', { design: JSON.stringify(data.design), html:data.html, companyId: company, templateName:values.templateName }, { headers: { 'Content-Type': 'application/json' } });

          if (response.status === 200) {
            toast.success(`Template de e-mail salvo com sucesso`);
            handleClose();
          }
        } catch (err) {
          toastError("Nome do template já existente");
          handleClose();
        }
      };
  
      await saveTemplate();
    };

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
          Criar novo template
        </DialogTitle>
        <Formik
          initialValues={templateForm}
          enableReinitialize={true}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSaveEmail(values);
            }, 400);
          }}
        >
          {({ values, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent dividers>
                <Field
                  as={TextField}
                  label="Digite o nome do template"
                  name="templateName"
                  helperText={touched.text && errors.text}
                  variant="outlined"
                  margin="dense"
                  style={{ width: '100%' }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="secondary"
                  disabled={isSubmitting}
                  variant="outlined"
                >
                  CANCELAR
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
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

export default CreateTemplateModal;
