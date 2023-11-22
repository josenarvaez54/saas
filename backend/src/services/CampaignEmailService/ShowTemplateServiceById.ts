import AppError from "../../errors/AppError";
import TemplateEmail from "../../models/TemplateEmail";


    const ShowTemplateServiceById = async (id: string | number): Promise<TemplateEmail> => {
        const record = await TemplateEmail.findByPk(id);
      
        if (!record) {
          throw new AppError("ERR_NO_TEMPLATE_FOUND", 404);
        }
      
        return record;
      };

export default ShowTemplateServiceById;
