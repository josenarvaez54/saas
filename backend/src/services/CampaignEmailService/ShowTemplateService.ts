import AppError from "../../errors/AppError";
import TemplateEmail from "../../models/TemplateEmail";

const ShowCapaignEmailService = async (id: string | number): Promise<TemplateEmail[] | null> => {
    try {
      const records: TemplateEmail[] = await TemplateEmail.findAll({
        where: {
          companyId: id
        },
      });
  
      return records;
    } catch (error) {
      return null;
    }
  };
export default ShowCapaignEmailService;
