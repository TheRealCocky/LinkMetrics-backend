import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LinkService {
  constructor(private prisma: PrismaService) {}

  // Create link for a user
  async createLink(
    userId: string,
    data: {
      originalUrl: string;
      alternativeUrls?: string[];
      weights?: number[];
    },
  ) {
    const alt = data.alternativeUrls || [];
    const weights = data.weights || alt.map(() => 1);

    // ensure clicksPerUrl same length
    const clicksPerUrl = alt.map(() => 0);

    return this.prisma.link.create({
      data: {
        originalUrl: data.originalUrl,
        alternativeUrls: alt,
        weights,
        clicksPerUrl,
        userId,
      },
    });
  }

  async getLinks(userId: string) {
    return this.prisma.link.findMany({ where: { userId } });
  }

  async getLinkById(id: string) {
    const link = await this.prisma.link.findUnique({ where: { id } });
    if (!link) throw new NotFoundException('Link not found');
    return link;
  }

  // compute metrics
  async getMetrics(id: string) {
    const link = await this.getLinkById(id);
    return {
      id: link.id,
      originalUrl: link.originalUrl,
      alternativeUrls: link.alternativeUrls, // <-- nome padronizado
      weights: link.weights,
      clicksPerUrl: link.clicksPerUrl,
      accessCount: link.accessCount,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  }


  // rotate: chooses an URL (original or an alternative?) — design decision:
  // I'll rotate among [originalUrl, ...alternativeUrls] so the originalUrl can be the default index 0.
  async rotate(id: string) {
    const link = await this.getLinkById(id);

    // list candidate urls: original is index 0
    const urls = [link.originalUrl, ...link.alternativeUrls];
    // weights: if weights empty, default equal
    const weights =
      link.weights && link.weights.length === urls.length
        ? link.weights
        : urls.map(() => 1);

    const pickedIndex = this.weightedIndex(weights);

    // increment counters atomically via prisma
    // update accessCount and clicksPerUrl[pickedIndex] increment
    // Prisma + Mongo: we will fetch and then update to avoid complex array update ops
    const updatedClicks =
      link.clicksPerUrl && link.clicksPerUrl.length === urls.length
        ? [...link.clicksPerUrl]
        : new Array(urls.length).fill(0);
    updatedClicks[pickedIndex] = (updatedClicks[pickedIndex] || 0) + 1;

    await this.prisma.link.update({
      where: { id },
      data: {
        accessCount: { increment: 1 } as any, // prisma mongo supports increment
        clicksPerUrl: updatedClicks,
      },
    });

    return { url: urls[pickedIndex], index: pickedIndex };
  }

  weightedIndex(weights: number[]) {
    const total = weights.reduce((s, w) => s + w, 0);
    if (total <= 0) {
      return Math.floor(Math.random() * weights.length);
    }
    let rnd = Math.random() * total;
    for (let i = 0; i < weights.length; i++) {
      rnd -= weights[i];
      if (rnd <= 0) return i;
    }
    return weights.length - 1;
  }

  async deleteLink(id: string, userId: string) {
    const link = await this.getLinkById(id);
    if (link.userId !== userId) throw new NotFoundException('Link not found');
    return this.prisma.link.delete({ where: { id } });
  }
  async getHistory(id: string) {
    const link = await this.getLinkById(id);

    return {
      id: link.id,
      originalUrl: link.originalUrl,
      alternativeUrls: link.alternativeUrls,
      clicksPerUrl: link.clicksPerUrl,
      accessCount: link.accessCount,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
    };
  }
}
