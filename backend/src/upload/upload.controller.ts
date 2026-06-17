import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';


const multerConfig = (pasta: string, prefixo: string) => ({
  storage: diskStorage({
    destination: `./uploads/${pasta}`,
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      cb(null, `${prefixo}-${uniqueSuffix}${ext}`);
    },
  }),
});

@Controller('api/v1/upload')
export class UploadController {
  
  @Post('jogador-foto')
  @UseInterceptors(
    FileInterceptor('foto', multerConfig('jogadores', 'jogador')),
  )
  uploadFotoJogador(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');
    return {
      fotoUrl: `http://localhost:3001/uploads/jogadores/${file.filename}`,
    };
  }

  
  @Post('equipe-escudo')
  @UseInterceptors(FileInterceptor('escudo', multerConfig('escudos', 'escudo')))
  uploadEscudoEquipe(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');
    return {
      escudoUrl: `http://localhost:3001/uploads/escudos/${file.filename}`,
    };
  }
}
