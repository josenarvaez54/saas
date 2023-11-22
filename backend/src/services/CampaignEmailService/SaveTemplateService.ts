import * as Yup from "yup";
import AppError from "../../errors/AppError";
import TemplateEmail from "../../models/TemplateEmail";

interface Data {
  companyId: any;
  templateName: string;
  html: string;
  design: string;
}

const SaveTemplateService = async (
  companyId: any,
  templateName: string,
  html: string,
  design: string
): Promise<TemplateEmail | false> => {
  const data: Data = { companyId, templateName, html, design};

  const ticketnoteSchema = Yup.object().shape({
    templateName: Yup.string()
      .min(3, "ERR_TEMPLATE_NAME")
      .required("ERR_TEMPLATE_NAME_REQUIRED"),
  });

  try {
    await ticketnoteSchema.validate(data);

    const existingTemplate = await TemplateEmail.findOne({
      where: {
        companyId: data.companyId,
        name: data.templateName
      },
    });

    if (existingTemplate) {
      return false;
    } else {

      const recordData = {
        companyId: data.companyId,
        name: data.templateName,
        html: data.html,
        design: data.design
      };

      const record = await TemplateEmail.create(recordData);

      console.log("finalizou")
      return record;
    }
  } catch (err: any) {
    throw new AppError(err.message);
  }
};


export default SaveTemplateService;
