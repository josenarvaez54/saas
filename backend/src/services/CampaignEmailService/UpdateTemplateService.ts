import AppError from "../../errors/AppError";
import Email from "../../models/Email";
import Help from "../../models/Help";
import TemplateEmail from "../../models/TemplateEmail";

interface Data {
  id: number | string;
  name: string;
  companyId?: string;
  html?: string;
  design?: string;
}

const UpdateTemplateService = async (data: Data): Promise<TemplateEmail> => {
  const { id } = data;

  const record = await TemplateEmail.findByPk(id);

  if (!record) {
    throw new AppError("ERR_NO_HELP_FOUND", 404);
  }

  await record.update(data);

  return record;
};

export default UpdateTemplateService;