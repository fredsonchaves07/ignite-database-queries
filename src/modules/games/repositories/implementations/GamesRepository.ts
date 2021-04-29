import { count } from 'node:console';
import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[] | undefined> {
    const games = await this.repository
        .createQueryBuilder('games')
        .where(`games.title ilike '%${param}%'`)
        .getMany();

    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT count(*) FROM games");
  }

  async findUsersByGameId(id: string): Promise<User[] | undefined> {

    const games = await this.repository 
                    .createQueryBuilder('games')
                    .innerJoinAndSelect("games.users", "users")
                    .where("games.id = :id", { id: id })
                    .getMany();
    
    return games[0]?.users;

  }
}

