import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Res,
  Delete,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';

@Controller('links')
export class LinkController {
  constructor(private linkService: LinkService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req, @Body() dto: CreateLinkDto) {
    return this.linkService.createLink(req.user.userId, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(@Request() req) {
    return this.linkService.getLinks(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/metrics')
  async metrics(@Param('id') id: string) {
    return this.linkService.getMetrics(id);
  }

  // rotate endpoint (public)
  // Example path: GET /links/abc123/rotate -> redirects to chosen URL
  @Get(':id/rotate')
  async rotate(@Param('id') id: string, @Res() res: express.Response) {
    const { url } = await this.linkService.rotate(id);
    return res.redirect(url);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/history')
  async history(@Param('id') id: string) {
    return this.linkService.getHistory(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.linkService.deleteLink(id, req.user.userId);
  }
}
