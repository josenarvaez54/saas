import AppError from "../../errors/AppError";
import Email from "../../models/Email";

const DeleteService = async (id: string): Promise<void> => {
  const record = await Email.findOne({
    where: { id }
  });

  if (!record) {
    throw new AppError("ERR_NO_HELP_FOUND", 404);
  }

  await record.destroy();
};

export default DeleteService;
