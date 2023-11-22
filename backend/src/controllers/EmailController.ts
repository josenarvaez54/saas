import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import CreateCampaignService from "../services/CampaignEmailService/CreateCampaignService";
import ListService from "../services/CampaignEmailService/ListEmailService";
import GenerateDkimKeys from "../services/CampaignEmailService/GenerateDkimService";
import VerifyDkimDNS from "../services/CampaignEmailService/VerifyDkimDns";
import ShowCapaignEmailService from "../services/CampaignEmailService/ShowCapaignEmailService";
import DeleteService from "../services/CampaignEmailService/DeleteService";
import UpdateService from "../services/CampaignEmailService/UpdateService";
import SaveTemplateService from "../services/CampaignEmailService/SaveTemplateService";
import ShowTemplateService from "../services/CampaignEmailService/ShowTemplateService";
import DeleteTemplateService from "../services/CampaignEmailService/DeleteTemplateService";
import UpdateTemplateService from "../services/CampaignEmailService/UpdateTemplateService";
import ShowTemplateServiceById from "../services/CampaignEmailService/ShowTemplateServiceById";
import SendEmail from "../services/CampaignEmailService/SendEmailService";

interface EmailData {
  name: string;
  from: string;
  companyId: number;
  userQueuesId: number;
}

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};


export const index = async (req: Request, res: Response): Promise<Response> => {
  const { pageNumber, searchParam} = req.query as IndexQuery;
  const { companyId } = req.user;

  const { email, count, hasMore } = await ListService({
    searchParam,
    pageNumber,
    companyId,
  });

  return res.json({ email, count, hasMore });
};

export const templates = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { companyId } = req.user;
    const templateList = await ShowTemplateService(companyId);

    return res.json({ success: true, templates: templateList });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return res.status(500).json({ success: false, error: 'Error fetching templates.' });
  }
};


export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  await DeleteService(id);

  const io = getIO();
  io.emit(`company-${companyId}-email`, {
    action: "delete",
    id
  });

  return res.status(200).json({ message: "Email deleted" });
};

export const removeTemplate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { companyId } = req.user;

  await DeleteTemplateService(id);

  const io = getIO();
  io.emit(`company-${companyId}-template`, {
    action: "delete",
    id
  });

  return res.status(200).json({ message: "Template deleted" });
};

export const updateTemplate = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data = req.body;
  console.log(data);
  const { id } = req.params;

  const record = await UpdateTemplateService({
    ...data,
    id: +id
  });

  return res.status(200).json(record);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const data = req.body;
  const { id } = req.params;

  const record = await UpdateService({
    ...data,
    id: +id
  });

  return res.status(200).json(record);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const record = await ShowCapaignEmailService(id);
  return res.status(200).json(record);
};

export const showTemplateById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  const record = await ShowTemplateServiceById(id);
  return res.status(200).json(record);
};


export const save = async (req: Request, res: Response): Promise<Response> => {
  const { html, design, companyId, templateName } = req.body;

  try {

    const htmlWithoutNewlines = html.replace(/\n/g, '');
    console.log('Depois do trim:', htmlWithoutNewlines);

    const templateRecord = await SaveTemplateService(companyId, templateName, htmlWithoutNewlines, design);

    if (templateRecord == false) {
      return res.status(400).json({ success: false, message: 'Template with the same name already exists.' });
    }

    return res.status(200).json({ success: true, message: 'Template saved successfully.' });
  } catch (error) {
    console.error('Error saving the file:', error);
    return res.status(500).json({ success: false, error: 'Error saving the file.' });
  }
};
export const generateKey = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { domain, companyId } = req.body;

    if (!domain || !companyId) {
      return res.status(400).json({ error: 'Parâmetros inválidos.' });
    }

    const dkimRecord = await GenerateDkimKeys({ domain, companyId });
    if(dkimRecord){
      return res.status(200).json(dkimRecord);
    }else{
    return res.status(500).json(dkimRecord);
  }
  } catch (error) {
    console.error('Erro no controller GenerateDkimKeysController:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const sendEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    const record = await SendEmail(parseInt(id), companyId);
   if(record.success == true){
    return res.status(200).json(record);
    }else{
    return res.status(500).json(record);
    }
  } catch (error) {
    console.error('Erro no controller GenerateDkimKeysController:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};


export const VerifyDNS = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const dkimRecord = await VerifyDkimDNS(parseInt(id));
    if(dkimRecord.success == true){
    return res.status(200).json(dkimRecord);
    }else{
    return res.status(500).json(dkimRecord);
    }
  } catch (error) {
    console.error('Erro no controller GenerateDkimKeysController:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const saveCampaignEmail = async (req: Request, res: Response): Promise<Response> => {
  const newEmail: EmailData = req.body;

  const contact = await CreateCampaignService({
    ...newEmail,
    name: newEmail.name,
    companyId: newEmail.companyId
  });

  return res.status(200).json(contact);
};
