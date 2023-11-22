import AppError from "../../errors/AppError";
import TemplateEmail from "../../models/TemplateEmail";

const DeleteTemplateService = async (id: string): Promise<void> => {
  const record = await TemplateEmail.findOne({
    where: { id }
  });

  if (!record) {
    throw new AppError("ERR_NO_TEMPLATE_FOUND", 404);
  }

  await record.destroy();
};

export default DeleteTemplateService;
