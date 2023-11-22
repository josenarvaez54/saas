import AppError from "../../errors/AppError";
import Email from "../../models/Email";
import Help from "../../models/Help";

interface Data {
  id: number | string;
}

const UpdateService = async (data: Data): Promise<Email> => {
  const { id } = data;

  const record = await Email.findByPk(id);

  if (!record) {
    throw new AppError("ERR_NO_HELP_FOUND", 404);
  }

  await record.update(data);

  return record;
};

export default UpdateService;