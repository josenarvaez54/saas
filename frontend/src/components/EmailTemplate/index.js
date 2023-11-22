import React, { useRef, useState, useEffect } from 'react';
import json from './teste.json';
import EmailEditor from 'react-email-editor';
import { saveAs } from 'file-saver';
import Button from "@material-ui/core/Button";
import api from "../../services/api";
import { toast } from "react-toastify";
import toastError from "../../errors/toastError";
import CreateTemplateModal from "../../components/CreateTemplateModal/index"
import { useLocation } from 'react-router-dom';

const UnlayerEmailEditor = (props) => {
  const companyId = localStorage.getItem("companyId");

  const [templateData, setTemplateData] = useState(null);
  const [handleNewTemplateOpen, setHandleNewTemplateOpen] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const templateId = searchParams.get('templateId');
  const emailEditorRef = useRef(null);
  const [template, setTemplate] = useState(null);
  const [loadTemplate, setLoadTemplate] = useState(false);

  useEffect(() => {
    if(templateId != null){
    const fetchTemplateUser = async () => {
      try {
        const { data } = await api.get(`/template/${templateId}`);
        setTemplate(data);
        setLoadTemplate(true);
      } catch (err) {
        toastError(err);
      }
    };

    fetchTemplateUser();
  }else{
    setLoadTemplate(true);
  }
  }, []);

  const exportHtml = () => {
    emailEditorRef.current.editor.exportHtml((data) => {
      const { html } = data;
      
      const blob = new Blob([html], { type: 'text/html' });
  
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
  
      link.download = '../templates/email_template.html';
  
      document.body.appendChild(link);
      link.click();
  
      document.body.removeChild(link);
    });
  };

  const handleSaveEmail = () => {
    emailEditorRef.current.editor.exportHtml(async (data) => {
      const { design, html } = data;
      setTemplateData({ ...data, html, design });
      setHandleNewTemplateOpen(true);
    });
  };

  const handleUpdate = (templateId) => {
    emailEditorRef.current.editor.exportHtml(async (data) => {
      try {
        const response = await api.put(`/template/${templateId}`, { design: JSON.stringify(data.design), html:data.html}, { headers: { 'Content-Type': 'application/json' } });

        if (response.status === 200) {
          toast.success(`Template de e-mail atualizado com sucesso`);
        }
      } catch (err) {
        toastError("Não foi possível atualizar");
      }
    });
  };

  const handleNewTemplateClose = () => {
    setHandleNewTemplateOpen(false);
    };


  
  const onLoad = () => {

    if(template != null){
      const teste = JSON.parse(template.design);
      return emailEditorRef.current.editor.loadDesign(teste);
    }else{
    const templateJson = { json };
    emailEditorRef.current.editor.loadDesign(templateJson.json);
    }

  };

  const onReady = () => {
    console.log('onReady');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ marginLeft: 'auto', marginRight: 15, marginTop: 5 }}>

        <CreateTemplateModal
        open={handleNewTemplateOpen}
        onClose={handleNewTemplateClose}
        company={companyId}
        data={templateData}
        />

        <Button
          style={{ marginRight: 5, backgroundColor: 'green', color: 'white' }}
          variant="contained"
          onClick={() => exportHtml(true)}
        >
          EXPORTAR
        </Button>
        {templateId != null ? (
        <Button
        style={{ marginRight: 5, backgroundColor: 'green', color: 'white' }}
        variant="contained"
        color="primary"
        onClick={() => handleUpdate(templateId)}
      >
        ATUALIZAR
      </Button>
        )
        :
        <Button
        style={{ marginRight: 5, backgroundColor: 'green', color: 'white' }}
        variant="contained"
        color="primary"
        onClick={() => handleSaveEmail(true)}
      >
        SALVAR
      </Button>
        }
      </div>

      
      {loadTemplate && (
        <EmailEditor
          style={{ flex: 1 }}
          ref={emailEditorRef}
          onLoad={onLoad}
          onReady={onReady}
        />
      )}
    </div>
  );
};


export default UnlayerEmailEditor;
