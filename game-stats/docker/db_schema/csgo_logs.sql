CREATE TABLE IF NOT EXISTS public._meta_logs
(
    id bigint NOT NULL,
    match_id character varying(20),
    raw_log text NOT NULL,
    log_time date NOT NULL,
    log_pattern_type character varying(50),
    log_parsed_items text[],
    PRIMARY KEY (id)
);


CREATE TABLE IF NOT EXISTS public.players
(
    id bigint NOT NULL,
    name character varying(20) NOT NULL,
    player_id integer DEFAULT NULL,
    steam_id character varying(50) NOT NULL,
    team_name character varying(20) DEFAULT NULL,
    performance jsonb DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.match_rounds
(
    id bigint NOT NULL,
    roundNumber integer NOT NULL,
    round_start_time date NOT NULL,
    round_end_time date NOT NULL,
    duration integer NOT NULL,
    team_score jsonb NOT NULL
    map_name character varying(20) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.match_highlights
(
    id bigint NOT NULL,
    message text NOT NULL,
    PRIMARY KEY (id)
);