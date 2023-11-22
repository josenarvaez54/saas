import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import MainContainer from "../../components/MainContainer";
import api from "../../services/api";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    display: 'flex',
    paddingLeft: 80,
    paddingRight: 80,
    flexWrap: 'wrap',
    padding: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    minHeight: '500px',
  },
  header: {
    textAlign: "center",
    padding: theme.spacing(2),
  },
  card: {
    position: 'relative',
    padding: '10px',
    borderRadius: '5px',
    marginRight: '3%',
    border: '1px solid #ccc',
    marginBottom: '10px',
    textAlign: 'center !important',
    overflowY: "hidden",
    "&:hover": {
      "&::before": {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajuste a opacidade conforme necessário
        zIndex: 1,
        borderRadius: '5px',
      },
    },
  },
  imageTemp: {
    width: '300px',
    objectFit: 'cover',
  },
  buttonContainer: {
    position: 'absolute',
    top: '50%',
    left: '53%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    gap: '10px',
    zIndex: 2,
  },
}));

const TemplateEmail = () => {
  const classes = useStyles();
  const [templates, setTemplates] = useState([]);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/templates");

        const templatesWithImage = await Promise.all(data.templates.map(async (template) => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = template.html;

          document.body.appendChild(tempDiv);

          await new Promise(resolve => setTimeout(resolve, 100));

          const canvas = await html2canvas(tempDiv);
          const image = canvas.toDataURL('image/png');

          document.body.removeChild(tempDiv);

          return {
            ...template,
            imageHtml: image,
          };
        }));

        setTemplates(templatesWithImage);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchData();
  }, [deleted]);

  const handleDelete = async (id) => {
      await api.delete(`/template/${id}`);
      toast.success("Template deletado com sucesso");
      setDeleted(prevDeleted => !prevDeleted);
  }

  return (
    <MainContainer className={classes.mainContainer}>
      <MainHeader>
        <Title>TEMPLATES DE E-MAIL</Title>
        <MainHeaderButtonsWrapper>
          <input type="file" id="fileInput" style={{ display: 'none' }} />
          <Link to="/template/create">
            <Button variant="contained" color="primary">
              CRIAR NOVO MODELO
            </Button>
          </Link>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper className={classes.mainPaper} variant="outlined">
        {templates.map((template, index) => (
          <div
            key={index}
            className={classes.card}
            onMouseEnter={() => setHoveredTemplate(index)}
            onMouseLeave={() => setHoveredTemplate(null)}
          >
            <Title>{template.name}</Title>
            <div style={{ width: '300px', height: '500px', overflow: 'scroll', position: 'relative', scrollbarColor: 'red' }}>
              <img src={template.imageHtml} alt={`Template ${index}`} style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
              {hoveredTemplate === index && (
                <div className={classes.buttonContainer}>
<Button
  variant="contained"
  color="primary"
  component={Link}
  to={{
    pathname: '/template/create',
    search: `?templateId=${template.id}`,
  }}
>
  Editar
</Button>
                  <Button onClick={() => handleDelete(template.id)} variant="contained" color="secondary">
                    Excluir
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </Paper>
    </MainContainer>
  );
};

export default TemplateEmail;
