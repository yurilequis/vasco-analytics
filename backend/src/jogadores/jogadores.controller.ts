import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express'; // Importamos o Request nativo

@Controller('api/v1/upload')
export class UploadController {
  @Post('jogador-foto')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: join(
          process.cwd(),
          '..',
          'frontend',
          'public',
          'fotos-jogadores',
        ),
        // Tipagem explícita adicionada aqui:
        filename: (
          _req: Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          const sufixoUnico =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extensao = extname(file.originalname);
          callback(null, `jogador-${sufixoUnico}${extensao}`);
        },
      }),
      // Tipagem explícita adicionada aqui:
      fileFilter: (
        _req: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException(
              'Apenas imagens (png, jpg, webp) são permitidas!',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  uploadFoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }
    return { fotoUrl: `/fotos-jogadores/${file.filename}` };
  }
}
